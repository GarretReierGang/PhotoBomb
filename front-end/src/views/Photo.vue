<template>
<div class="photo">
  <div v-if="photo" class="image">
    <img :src="photo.path" />
    <div class="photoInfo">
      <p class="photoTitle"> {{photo.title}}</p>
      <p class="photoName"> {{photo.user.firstName}} {{photo.user.lastName}}</p>
    </div>
    <p class="photoDate">{{formatDate(photo.created)}}</p>
    <p class="photoDescription"> {{ photo.description }} </p>
  </div>
  <div v-if="user">
    <br />
    <CommentList class="comments" />
  </div>
  <div v-else>
    <hr />
    <p>You must log on to view/add comments</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import CommentList from '@/components/CommentList.vue'

export default {
  name: 'Photo',
  data () {
    return {
      photo: null,
    }
  },
  created() {
    this.getPhoto();
    this.retrieveUser();
  },
  components: {
    CommentList,
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async getPhoto() {
      try {
        this.response = await axios.get("/api/photos/single/" + this.$route.params.id);
        this.photo = this.response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    async retrieveUser() {
      try {
        console.log("created");
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
        console.log(this.user);
      } catch (error) {
        this.$root.$data.user = null;
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
.photo {
  padding-top: 100px;
}

.photoInfo {
  justify-content: center;
  padding-horizontal: 10px;
}
.photoInfo p {
  margin: 0px 10px;
}
.photoName {
  font-size: 0.8em;
}

.photoDate {
  font-size: 0.6em;
  font-weight: normal;
}
p {
  margin: 0px;
}
</style>
