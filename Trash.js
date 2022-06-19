function useSocket(jwt) {
  const [socket, setSocket] = React.useState();

  React.useEffect(() => {
    if (jwt) {
      const soc = io.connect(SERVER_URL, { query: { token: jwt } });
      setSocket(soc);
      return () => soc.close();
    }
  }, [jwt]);

  return socket;
}