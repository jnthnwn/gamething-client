<script>
import { setName, start, replay } from './actions';

export default {
  name: 'GameBase',
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
    playerName: ''
  }),
  computed: {
    common() {
      return this.gameState.common || {};
    },
    player() {
      return this.gameState.player || {};
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
    replay() {
      this.send(replay());
    },
    onSetName(event, name) {
      if (event.data === ' ') {
        return;
      }
      this.playerName = name;
      this.send(setName(name.trim()));
    },
  }
};
</script>
