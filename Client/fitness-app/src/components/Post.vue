<template>
  <div class="panel-block" v-if="!deleted">
    <div class="box w-100">
      <article class="media">
        <div class="media-left">
          <figure class="image is-square is-48x48">
            <img class="is-rounded" :src="imageUrl(post.user_id)" alt="Image" />
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <div>
              <span class="level is-marginless">
                <span class="level-left">
                  <span class="level-item">
                    <strong>
                      <router-link to="/user/username">{{
                        `${post.user_id.firstName} ${post.user_id.lastName}`
                      }}</router-link>
                    </strong>
                    <small class="pr-4px">
                      <router-link to="/user/username"
                        >@{{ post.user_id.username }}</router-link
                      >
                    </small>

                    <strong class="spacing">{{ post.type }} </strong>
                    <strong class="spacing">{{ post.length }} </strong>
                    <strong class="spacing">{{ post.timeUnit }} </strong>
                    <strong class="spacing">{{ post.foodType }}</strong>
                  </span>
                </span>
              </span>

              <span class="level">
                <span class="level-left">
                  <small class="pr-4px">{{ post.timePosted }} </small>
                  <small class="pr-4px">
                    <span
                      v-if="this.post.numberOfCaloriesBurned"
                      class="icon is-small"
                    >
                      <i class="fas fa-dumbbell" />
                    </span>

                    <span
                      v-if="!this.post.numberOfCaloriesBurned"
                      class="icon is-small"
                      ><i class="fas fa-hamburger"></i
                    ></span>
                  </small>
                  <!-- <small class="pr-4px">Exercise name</small> -->
                  <small class="pr-4px">{{ post.calories }}</small>
                  <small class="pr-4px">{{
                    post.numberOfCaloriesBurned
                  }}</small>
                  <small class="pr-4px">calories </small>
                  <small v-if="this.post.numberOfCaloriesBurned" class="pr-4px"
                    >burned
                  </small>
                  <small v-if="!this.post.numberOfCaloriesBurned" class="pr-4px"
                    >ingested
                  </small>
                </span>
                <span class="level-right"></span>
              </span>
              <p>{{ post.description }}</p>
            </div>
          </div>
          <nav class="level is-mobile">
            <div v-if="isLoggedIn" class="level-left">
              <a
                style="margin-right: 5px"
                aria-label="like"
                @click="likeButtonClick()"
              >
                <div v-if="isLikedByUser">
                  <span class="icon is-small">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                  </span>
                </div>
                <div v-if="!isLikedByUser">
                  <span class="icon is-small">
                    <i class="far fa-heart" aria-hidden="true"></i>
                  </span>
                </div>
              </a>
              <small style="margin-right: 5px" class="is-small">{{
                this.likes
              }}</small>

              <div
                v-if="isDeleteVisible"
                class="level-item"
                @click="deletePost"
                style="cursor: pointer"
              >
                <span class="icon is-small has-text-danger">
                  <i class="fas fa-trash-alt" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div v-else class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <small v-if="post.public" class="is-small has-text-primary"
                  >Public</small
                >
                <small v-if="!post.public" class="is-small has-text-danger"
                  >Private</small
                >
              </div>
            </div>
          </nav>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "../axiosConfig";

export default {
  name: "Post",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      likes: 0,
      isLikedByUser: false,
      deleted: false,
    };
  },
  methods: {
    imageUrl(user) {
      console.log(user.imageUrl);
      var url = "http://localhost:3000/";
      if (user.imageUrl != "" && user.imageUrl != null) {
        return url + user.imageUrl;
      } else {
        return "https://www.attendit.net/images/easyblog_shared/July_2018/7-4-18/totw_network_profile_400.jpg";
      }
    },
    likeButtonClick() {
      //is post containts numberOfCaloriesBurned it means it is exercise otherwise we know it is food
      // this logic is implemented on few other places too
      var exerciseOrPost = this.post.numberOfCaloriesBurned
        ? "/exercise"
        : "/food";
      axios
        .patch(exerciseOrPost + "/like/" + this.post._id)
        .then(({ data }) => {
          this.isLikedByUser = !this.isLikedByUser;
          this.likes = this.isLikedByUser ? this.likes + 1 : this.likes - 1;
        })
        .catch(() => {});
    },

    deletePost() {
      if (this.post.numberOfCaloriesBurned) {
        axios.delete("/exercise/" + this.post._id).then((data) => {
          console.log(data);
          this.deleted = true;
        });
      } else {
        axios.delete("/food/" + this.post._id).then((data) => {
          console.log(data);
          this.deleted = true;
        });
      }
    },
  },
  mounted() {
    this.likes = this.post.usersThatLikedPost.length;
    this.isLikedByUser = this.post.usersThatLikedPost.includes(
      this.getCurrentUser._id
    )
      ? true
      : false;
  },
  computed: {
    ...mapGetters(["isLoggedIn", "getLikedPosts", "getCurrentUser"]),
    isDeleteVisible: function () {
      if (this.getCurrentUser.role === "ADMIN") return true;
      if (this.getCurrentUser._id === this.post.user_id._id) return true;
      return false;
    },
  },
};
</script>

<style >
.w-100 {
  width: 100%;
}
.pr-4px {
  padding-right: 4px;
}
.row-height-adjust {
  line-height: 0.5rem !important;
}
.spacing {
  margin-right: 5px;
}
.rounded-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>