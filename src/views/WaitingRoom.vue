<script>
import { setName, start } from '../games/actions';

export default {
  name: 'WaitingRoom',
  props: {
    gameState: {
      type: Object,
      default: () => ({})
    },
    send: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    playerName: '',
    displayNameLengthError: ''
  }),
  created() {
    if (this.started) {
      this.$router.push(this.common.gameSlug);
    }
    if (this.player.name) {
      this.playerName = this.player.name;
    }
  },
  watch: {
    started(val) {
      if (val) {
        this.$router.push(this.common.gameSlug);
      }
    }
  },
  computed: {
    common() {
      return this.gameState.common || {};
    },
    player() {
      return this.gameState.player || {};
    },
    started() {
      return this.common.started || false;
    },
    names() {
      return this.common.names || [];
    },
    roomCode() {
      return this.common.roomCode || '';
    },
    allPlayersReady() {
      return !(this.names.some(name => name === null));
    }
  },
  methods: {
    start() {
      this.send(start());
    },
    setName(event) {
      let name = event.target.value;
      if (event.data === ' ') {
        name = name.trim();
      }
      if (name.length > 12) {
        name = name.substring(0, 12);
        event.target.value = name;

        this.displayNameLengthError = true;

        setTimeout(() => {
          this.displayNameLengthError = false;
        }, 3000);

        return;
      }
      this.playerName = name;
      this.send(setName(name));
    },
  }
};
</script>

<template lang='pug'>
#waiting-room
  .section
    h1 {{common.gameSlug}}

  .section
    h2 room code: {{common.roomCode}}

  .section
    h2 rules:
    .rules
      p(v-for='rule in common.rules')
        | {{rule}}

  .section
    h2 players:
    ul
      li.player-name-list(v-for="name in names" :key='name')
        | {{name ? name : '...' }}

  .section
    h2 who are you?
    div
      input.player-name-entry(:value='playerName' type='text' @input='setName($event)' placeholder='12 chars, no spaces')
      span.error.player-name-length-error(v-if='displayNameLengthError') (12 char max)

  .section.errors(v-if='common && common.errors')
    h3.error(v-for='error in Object.keys(common.errors)' key='error') {{error}}

  button.section.start(v-show='allPlayersReady' @click='start') everyone's ready!
</template>

<style lang='scss' scoped>
#waiting-room {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;

  h1, h2 {
    margin-bottom: 5px;
  }

  h1 {
    font-size: 48px;
  }

  h2 {
    font-size: 30px;
  }

  p + p {
    margin-top: 10px;
  }

  .section + .section {
    margin-top: 15px;
  }

  .errors {
    text-align: center;
  }

  ul {
    padding-left: 30px;
  }

  button.start {
    border: 2px solid black;
    padding: 3px 5px;
    width: 100%;

    font-size: 30px;
    background-color: white;
  }

  .error {
    color: red;
    font-weight: bold;
  }
}
</style>
