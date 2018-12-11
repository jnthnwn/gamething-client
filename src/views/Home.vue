<script>
export default {
  name: 'Home',
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    roomCode: '',
    gameSlug: '',
  }),
  methods: {
    roomCodeInput(event) {
      const caretPos = event.target.selectionStart;
      this.roomCode = event.target.value.toUpperCase();
      this.$nextTick(() => { event.target.selectionEnd = caretPos; });
    },
    roomCodeChange(event) {
      this.roomCode = event.target.value.trim();
    },
    submit() {
      const params = {};
      params.roomCode = (this.path === '/join' && this.roomCode) || null;
      params.gameSlug = this.gameSlug || null;
      this.$emit('connect', params);
    },
  },
};
</script>

<!---->

<template lang='pug'>
#home
  router-link#logo(to='/') gamething

  #button-bar(v-if='path === "/"')
    router-link(tag='button' to='join') join
    router-link(tag='button' to='create') create

  form(v-else @submit.prevent='submit' autocomplete='off')
    template(v-if='path === "/create"')
      label(for='game-selection') choose a game:
      #game-selection
        button(@click='gameSlug = "fake-artist"') fake-artist
    template(v-else-if='path === "/join"')
      label(for='room-code') room code
      input(autofocus id='room-code' type='text' :value='roomCode' @input='roomCodeInput' @change='roomCodeChange')
      button join
</template>

<!---->

<style lang='scss' scoped>
@import url('https://fonts.googleapis.com/css?family=Nanum+Pen+Script');

#home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30vh;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-top: 5px;
    }
  }

  fieldset {
    padding: 0;
    border: none;
  }

  label {
    font-weight: bold;
    margin-bottom: 3px;
  }

  input[type=text] {
    width: 100px;
    text-align: center;
  }

  #logo {
    color: black;
    font-family: 'nanum pen script';
    font-size: 80px;
    text-decoration: none;
    &:visited {
      color: black;
    }
  }

  #button-bar {
    button + button {
      margin-left: 5px;
    }
  }

  #game-selection {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    button + button {
      margin-top: 5px;
    }
  }
}
</style>
