<script>
import GameBase from '../GameBase';
import { draw, stopDraw, startTurn, vote } from './actions';
import FakeArtistCanvas from './FakeArtistCanvas';

export default {
  name: 'fake-artist',
  extends: GameBase,
  components: {
    FakeArtistCanvas
  },
  props: {
    gameState: {
      type: Object,
      default: () => ({})
    },
    send: {
      type: Function,
      required: true
    },
  },
  data: () => ({
    sideLength: Math.min(500, Math.min(window.innerWidth)*0.95)
  }),
  computed: {
    isPlayerTurn() {
      return this.player.isTurn;
    },
    headerMessage() {
      if (this.common.voting) {
        return 'voting time';
      } else {
        return this.player.isFakeArtist ? 'you are the <b>fake artist</b>' : `the topic is ${this.player.topic}`;
      }
    },
    footerMessage() {
      if (this.common.voting) {
        if (this.player.hasVoted) {
          return 'waiting for other players to vote';
        } else if (this.player.isFakeArtist) {
          return 'press anytime to "cast your vote"';
        } else {
          return 'who do you think is the fake artist?';
        }
      } else if (this.common.finished) {
        const boldName = `<b>${this.common.fakeArtistName}</b>`;
        if (this.common.caught) {
          return `${boldName} was the fake artist and got caught!`;
        } else {
          return `${boldName} was the fake artist and got away with it!`;
        }
      } else {
        if (this.isPlayerTurn) {
          return this.common.turnInProgress ? 'you are drawing' : `it's your turn`;
        } else {
          const boldName = `<b>${this.common.activeArtistName}</b>`;
          return this.common.turnInProgress ? `${boldName} is drawing` : `it's ${boldName}'s turn`;
        }
      }
    },
  },
  methods: {
    startTurn() {
      this.send(startTurn());
    },
    draw(x, y) {
      this.send(draw(x, y));
    },
    stopDraw() {
      this.send(stopDraw());
    },
    vote(name) {
      this.send(vote(name));
    },
  }
};
</script>

<!---->

<template lang='pug'>
#fake-artist
  .header-message(v-html='headerMessage')

  fake-artist-canvas(
    :disabled='!player.isTurn'
    :drawn-lines='common.drawnLines'
    :current-line='common.currentLine'
    :sideLength='sideLength'
    @draw='draw'
    @stopDraw='stopDraw'
  )

  .footer-message(v-html='footerMessage')

  template(v-if='common.voting')
    button.name(v-if='player.isFakeArtist' @click='vote()') vote
    .names(v-else-if='!player.hasVoted')
      button.name(v-for='name in common.names' v-if='name != player.name' @click='vote(name)') {{name}}

  template(v-else-if='common.finished')
    button(@click='replay()') replay

  template(v-else)
    button(v-if='isPlayerTurn && !common.turnInProgress' @click='startTurn') start drawing

    .names
      .name(v-for='name in common.names')
        span(:class='{ active: common.activeArtistName === name}') {{name}}
</template>
<!---->

<style lang='scss' scoped>
#fake-artist {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 20px;

  > div {
    text-align: center;
  }
}

.header-message {
  margin-bottom: 5px;
}

.footer-message {
  margin-bottom: 5px;
}

.name {
  min-width: 50px;
  display: inline-block;
}

.names {
  display: flex;
  flex-direction: column;
  padding-top: 5px;

  .name + .name {
    margin-left: 5px;
  }

  .active {
    font-weight: bold;
  }

  .active::after {
    content: '';
    display: inline-block;
    height: 16px;
    width: 16px;
    margin-left: 5px;
    background-image: url('./drawing.gif');
    background-size: contain;
    background-repeat: none;
    background-position: center;
  }
}

.voteName + .voteName {
  padding-top: 5px;
}

</style>
