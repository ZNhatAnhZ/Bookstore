import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import time

start_time = time.time()


class CF(object):
    def __init__(self, Y_data, k, uuCF=1):
        self.uuCF = uuCF  # user-user (1) or item-item (0) CF
        self.Y_data = Y_data
        self.k = k
        self.Ybar_data = None
        # number of users and items. Remember to add 1 since id starts from 0
        self.n_users = int(np.max(self.Y_data[:, 0])) + 1
        self.n_items = int(np.max(self.Y_data[:, 1])) + 1

    def normalize_Y(self):
        users = self.Y_data[:, 0]  # all users - first col of the Y_data
        self.Ybar_data = self.Y_data.copy()
        for n in range(self.n_users):
            # row indices of rating done by user n
            # since indices need to be integers, we need to convert
            ids = np.where(users == n)[0]
            # indices of all ratings associated with user n
            # and the corresponding ratings
            ratings = self.Y_data[ids, 2]
            # print(ratings)
            # take mean
            m = np.mean(ratings)
            # normalize
            self.Ybar_data[ids, 2] = ratings - m

        ################################################
        # form the rating matrix as a sparse matrix. Sparsity is important
        # for both memory and computing efficiency. For example, if #user = 1M,
        # #item = 100k, then shape of the rating matrix would be (100k, 1M),
        # you may not have enough memory to store this. Then, instead, we store
        # nonzeros only, and, of course, their locations.
        self.Ybar = sparse.coo_matrix(
            (self.Ybar_data[:, 2], (self.Ybar_data[:, 1], self.Ybar_data[:, 0])),
            (self.n_items, self.n_users),
        )

        self.Ybar = self.Ybar.tocsr()

    def similarity(self):
        self.S = cosine_similarity(self.Ybar.T, self.Ybar.T)

    def __pred(self, u, i):
        """
        predict the rating of user u for item i (normalized)
        if you need the un
        """
        # Step 1: find all users who rated i
        ids = np.where(self.Y_data[:, 1] == i)[0]
        # Step 2:
        users_rated_i = (self.Y_data[ids, 0]).astype(np.int32)
        # Step 3: find similarity btw the current user and others
        # who already rated i
        sim = self.S[u, users_rated_i]
        # Step 4: find the k most similarity users
        a = np.argsort(sim)[-self.k :]
        # and the corresponding similarity levels
        nearest_s = sim[a]
        # How did each of 'near' users rated item i
        r = self.Ybar[i, users_rated_i[a]]
        # add a small number, for instance, 1e-8, to avoid dividing by 0
        return (r * nearest_s)[0] / (np.abs(nearest_s).sum() + 1e-8)

    def fit(self):
        self.normalize_Y()
        self.similarity()

    def recommend(self, u):

        """
        Determine all items should be recommended for user u.
        The decision is made based on all i such that:
        self.pred(u, i) > 0. Suppose we are considering items which
        have not been rated by u yet.
        """
        ids = np.where(self.Y_data[:, 0] == u)[0]
        items_rated_by_u = self.Y_data[ids, 1].tolist()
        recommended_items = []
        for i in range(self.n_items):
            if i not in items_rated_by_u:
                rating = self.__pred(u, i)
                if rating > 0:
                    recommended_items.append(i)

        return recommended_items

    def print_recommendation(self):
        """
        print all items which should be recommended for each user
        """
        print("Recommendation: ")
        for u in range(self.n_users):
            recommended_items = self.recommend(u)
            if self.uuCF:
                print("    Recommend item(s):", recommended_items, "for user", u)
            else:
                print("    Recommend item", u, "for user(s) : ", recommended_items)


sample = [
    [0, 0, 5.0],
    [0, 1, 4.0],
    [0, 3, 2.0],
    [0, 4, 2.0],
    [1, 0, 5.0],
    [1, 2, 4.0],
    [1, 3, 2.0],
    [1, 4, 0.0],
    [2, 0, 2.0],
    [2, 2, 1.0],
    [2, 3, 3.0],
    [2, 4, 4.0],
    [3, 0, 0.0],
    [3, 1, 0.0],
    [3, 3, 4.0],
    [4, 0, 1.0],
    [4, 3, 4.0],
    [5, 1, 2.0],
    [5, 2, 1.0],
    [6, 2, 1.0],
    [6, 3, 4.0],
    [6, 4, 5.0],
]

Y_data = np.array(sample)
rs = CF(Y_data, k=2, uuCF=1)
rs.fit()
rs.print_recommendation()

print("--- %s seconds ---" % (time.time() - start_time))
