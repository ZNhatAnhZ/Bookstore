from numpy.core.fromnumeric import size
import pandas as pd
import numpy as np
from pandas.core.frame import DataFrame
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import sys, json
import traceback


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

        for user in users:
            this_user_index = np.where(
                self.data[:, 0] == user
            )  # get index of this user
            this_user_ratings = self.data[
                this_user_index, 2
            ]  # take rating of this user
            mean_rating = np.mean(this_user_ratings)
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
        index_user_rated_this_item = np.where(self.data[:, 1] == item)[
            0
        ]  # get rated user index to find users

        all_users_rated_this_item = (self.data[index_user_rated_this_item, 0]).astype(
            np.int32
        )  # get rated users

        if user >= len(self.similar_user):
            return np.NaN
        else:
            rated_user_similarity = self.similar_user[
                user, all_users_rated_this_item
            ]  # get users similarity to this user

        index_of_nearest_limited_rated_user = np.argsort(rated_user_similarity)[
            -self.userLimit :
        ].astype(
            np.int32
        )  # get index of users which have the highest similarity

        rating_of_nearest_user = self.normalized_matrix[
            item, all_users_rated_this_item[index_of_nearest_limited_rated_user]
        ]  # get rating of those nearest users

        all_nearest_user_similarity = rated_user_similarity[
            index_of_nearest_limited_rated_user
        ]

        return (rating_of_nearest_user * all_nearest_user_similarity)[0] / (
            np.abs(all_nearest_user_similarity).sum() + 1e-8
        )

    def generate_prerequisite(self):
        self.normalize_data()
        self.generate_user_similarity_matrix()

    def recommend(self, user):
        self.generate_prerequisite()

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


try:
    jsondata = json.loads(sys.argv[1])
    arrayOfReviews = np.asarray(jsondata, dtype=np.float)
    rs = Recommendation_System(arrayOfReviews, 4)
    data = rs.recommend(int(sys.argv[2]))
    print(data)
    sys.stdout.flush()
except Exception as e:
    # print(traceback.format_exc())
    sys.stdout.flush()


