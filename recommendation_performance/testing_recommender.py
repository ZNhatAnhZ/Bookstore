from numpy.core.fromnumeric import size
import pandas as pd
import numpy as np
from pandas.core.frame import DataFrame
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import sys, json
import traceback
import time

start_time = time.time()


class Recommendation_System(object):
    def __init__(self, data, userLimit):
        self.data = data
        self.userLimit = userLimit  # number of user neighbours
        self.normalized_data = self.data.copy()

    def normalize_data(self):
        users = np.unique(self.data[:, 0]).astype(
            np.int32
        )  # take the unique users column
        items = np.unique(self.data[:, 1]).astype(np.int32)
        self.mu = np.zeros((int(np.max(users)) + 1,))

        for user in users:
            this_user_index = np.where(
                self.data[:, 0] == user
            )  # get index of this user
            this_user_ratings = self.data[
                this_user_index, 2
            ]  # take rating of this user
            mean_rating = np.mean(this_user_ratings)
            if np.isnan(mean_rating):
                mean_rating = 0  # to avoid empty array and nan value
            self.mu[user] = mean_rating
            self.normalized_data[this_user_index, 2] -= mean_rating

        self.normalized_matrix = sparse.coo_matrix(
            (
                self.normalized_data[:, 2],
                (self.normalized_data[:, 1], self.normalized_data[:, 0]),
            ),
            (int(np.max(items)) + 1, int(np.max(users)) + 1),
        )
        self.normalized_matrix = self.normalized_matrix.tocsr()

    def generate_user_similarity_matrix(self):
        self.similar_user = cosine_similarity(
            self.normalized_matrix.T, self.normalized_matrix.T
        )

    def predict(self, user, item):
        # print("################################################################")
        # print("PREDICT FOR ITEM: ", item)
        index_user_rated_this_item = np.where(self.data[:, 1] == item)[0].astype(
            np.int32
        )  # get rated user index to find users

        all_users_rated_this_item = (self.data[index_user_rated_this_item, 0]).astype(
            np.int32
        )  # get rated users
        # print("All USER RATED THIS ITEM: ", all_users_rated_this_item)
        if user >= len(self.similar_user):
            return np.NaN
        else:
            rated_user_similarity = self.similar_user[
                user, all_users_rated_this_item
            ]  # get users similarity to this user
        # print("USERS SIMILARITY TO USER", user, ":", rated_user_similarity)
        index_of_nearest_limited_rated_user = np.argsort(rated_user_similarity)[
            -self.userLimit :
        ].astype(
            np.int32
        )  # get index of users which have the highest similarity

        rating_of_nearest_user = self.normalized_matrix[
            item,
            all_users_rated_this_item[index_of_nearest_limited_rated_user],
        ]  # get rating of those nearest users

        all_nearest_user_similarity = rated_user_similarity[
            index_of_nearest_limited_rated_user
        ]  # get similarity value of those nearest users
        # print("RATING OF THOSE NEAREST USERS: ")
        # print(rating_of_nearest_user)
        result = (rating_of_nearest_user * all_nearest_user_similarity)[0] / (
            np.abs(all_nearest_user_similarity).sum() + 1e-8
        )
        # print("PREDICTED RATING OF USER", user, "FOR ITEM", item, ": ", result)
        return result + self.mu[user]

    def generate_prerequisite(self):
        self.normalize_data()
        self.generate_user_similarity_matrix()
        # print("###############################################################")
        # print("NORMALIZED MATRIX: ")
        # print(self.normalized_matrix)
        # print("\n")

        # print("USER SIMILARITY MATRIX: ")
        # print(DataFrame(self.similar_user))
        # print("\n")

    def recommend(self, user):
        # self.generate_prerequisite()

        recommended_items_dict = {}
        ids = np.where(self.data[:, 0] == user)[0]
        items_rated_by_this_user = self.data[ids, 1].astype(np.int32)
        all_items = np.unique(self.data[:, 1].astype(np.int32))

        for item in all_items:
            if item not in items_rated_by_this_user:
                rating = self.predict(user, item)
                if rating > 0:
                    recommended_items_dict[item] = rating
        recommended_items_dict = sorted(
            recommended_items_dict.items(), key=lambda x: x[1], reverse=True
        )

        recommended_item = []
        if len(recommended_items_dict) > 6:
            for i in range(6):
                recommended_item.append(list(recommended_items_dict)[i][0])
        else:
            for i in range(len(recommended_items_dict)):
                recommended_item.append(list(recommended_items_dict)[i][0])

        return recommended_item


r_cols = ["user_id", "movie_id", "rating", "unix_timestamp"]

ratings_base = pd.read_csv(
    "C:\\Users\\NhatAnh\\Desktop\\ProjectWeb2\\recommendation_performance\\ml-100k\\ub.base",
    sep="\t",
    names=r_cols,
    encoding="latin-1",
)
ratings_test = pd.read_csv(
    "C:\\Users\\NhatAnh\\Desktop\\ProjectWeb2\\recommendation_performance\\ml-100k\\ub.test",
    sep="\t",
    names=r_cols,
    encoding="latin-1",
)

rate_train = ratings_base.to_numpy(dtype=np.float64)
rate_test = ratings_test.to_numpy(dtype=np.float64)


# indices start from 0
rate_train[:, :2] -= 1
rate_test[:, :2] -= 1


rs = Recommendation_System(rate_train, 30)
rs.generate_prerequisite()

n_tests = rate_test.shape[0]

SE = 0  # squared error
for n in range(n_tests):
    pred = rs.predict(
        rate_test[n, 0].astype(np.int64), rate_test[n, 1].astype(np.int64)
    )
    SE += (pred - rate_test[n, 2]) ** 2

RMSE = np.sqrt(SE / n_tests)
print("Deviation =", RMSE)

print("Execution time = %s seconds" % (time.time() - start_time))
