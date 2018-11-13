<script>
import merge from 'lodash.mergewith';

export default {
  name: 'App',
  data: () => ({
    gameState: {},
    gameSlug: '',
    sock: null,
    ws_url: process.env.VUE_APP_WS_URL,
  }),
  created() {
    const params = {};

    if (sessionStorage.getItem('playerId')) {
      params['playerId'] = sessionStorage.getItem('playerId');
    }
    if (sessionStorage.getItem('roomCode')) {
      params['roomCode'] = sessionStorage.getItem('roomCode');
    }

    if (Object.keys(params).length === 2) {
      this.connect(params);
    }
  },
  methods: {
    send(obj) {
      this.sock.send(JSON.stringify(obj));
    },
    _customizer(objValue, srcValue) {
      if (Array.isArray(objValue)) {
        if (Object.keys(srcValue).length === 0) {
          return [];
        }
        for (let key in srcValue) {
          objValue[key] = srcValue[key];
        }
        return objValue;
      } else if (typeof objValue === 'object') {
        const result = merge(objValue, srcValue, this._customizer);
        for (let key in result) {
          if (result[key] === null) {
            delete result[key];
          }
        }
        return result;
      }
      return srcValue;
    },
    updateGameState(json) {
      const gameState = JSON.parse(JSON.stringify(this.gameState));

      const newState = merge(gameState, json, this._customizer);
      this.gameState = newState;
    },
    connect(params) {
      const url = new URL(this.ws_url);

      Object.keys(params).map(key => {
        params[key] !== null && url.searchParams.append(key, params[key]);
      });

      url.search = url.searchParams;

        this.sock = new WebSocket(url);
        this.sock.addEventListener('error', this.onSockError);
        this.sock.addEventListener('close', this.onSockClose);
        this.sock.addEventListener('message', this.onSockMessage);
    },
    onSockClose() {
      this.gameState = {};
      this.$router.push('/');
    },
    onSockMessage(event) {
      const diff = JSON.parse(event.data);
      if (diff.player && diff.player.id) {
        sessionStorage.setItem('playerId', diff.player.id);
      }
      if (diff.common) {
        if (diff.common.roomCode) {
          sessionStorage.setItem('roomCode', diff.common.roomCode);
        }
        if (diff.common.gameSlug) {
          this.gameSlug = diff.common.gameSlug;
        }
        if (diff.common.started) {
          this.$router.push(this.gameSlug);
        }
        if (diff.common.started === false) {
          this.$router.push('wait');
        }
      }

      this.updateGameState(diff);
    },
  },
};
</script>

<!---->

<template lang='pug'>
router-view(@connect='connect' :send='send' :game-slug='gameSlug' :game-state='gameState')
</template>

<!---->

<style lang='scss'>
html {
  height: 100%;
}

body {
  overflow: auto;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  font-family: helvetica, sans-serif;
  font-size: 16px;
}

button, input[type=submit] {
  border: 3px solid black;
  border-radius: 5px;
  font-weight: bold;
  padding: 3px 5px;
  background-color: white;
}

input[type=text] {
  border: none;
  border-bottom: 2px black solid;
  border-radius: 0;
  padding-left: 5px;
  &:active, &:focus {
    outline: none;
  }
}
</style>
