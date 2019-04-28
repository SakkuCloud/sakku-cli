const makeId = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 35; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export default makeId;
