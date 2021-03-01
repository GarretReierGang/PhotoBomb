<template>
<section class="Comments">
  <div class='comment' v-for="comment in comments" v-bind:key="comment._id">
    <hr />
    <p class='text'> {{ comment.content }} </p>
    <p class='time'> {{ formatDate(comment.created)}} </p>
    <p class='commentor'> {{ comment.user.firstName}} </p>
  </div>
  <hr />
  <form class="pure-form" @submit.prevent="addComment">
    <legend>Add your comment here</legend>
    <fieldset>
      <textarea v-model='newComment'></textarea>
      <br />
      <button class="pure-button pure-button-primary" type="submit">Submit</button>
      </fieldset>
  </form>
</section>
</template>
<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'CommentList',
  data() {
    return {
      comments: [],
      newComment: ''
    }
  },
  async created() {
    this.getComments();
  },
  methods: {
    async getComments() {
      try {
        this.response = await axios.get("/api/comments/" + this.$route.params.id);
        this.comments = this.response.data;
        console.log(this.comments);
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
    async addComment() {
      try {
        await axios.post("/api/comments/", {
          content: this.newComment,
          photo: this.$route.params.id,
        })
      } catch (error) {
        this.error = error.response.data.message;
      }
      this.getComments();
    }
  }
}
</script>
