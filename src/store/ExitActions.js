const actions = backend => {
  return {
    getExits: async ({ setState, state }) => {
      if (state.loading) return;

      if (!state.exits) {
        setState({ loading: true });
      }

      let exits = await backend.getExits();
      if (exits instanceof Error) {
        return setState({
          exitsError: state.t("exitsError"),
          exits: null,
          loading: false
        });
      }
      setState({ exitsError: null, exits, loading: false });
    },
    registerExit: async ({ setState, state }, nickname, email) => {
      await backend.registerExit(nickname, email);
      setState({ exits: await backend.getExits() });
    },
    resetExit: async ({ setState, state }, nickname) => {
      await backend.resetExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    selectExit: async ({ setState, state }, nickname) => {
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    },
    verifyExit: async ({ setState, state }, nickname, code) => {
      await backend.verifyExit(nickname, code);
      await backend.selectExit(nickname);
      setState({ exits: await backend.getExits() });
    }
  };
};

export default actions;