const ChangeToHTML = ({
  origin,
  replace,
}: {
  origin: string;
  replace?: string;
}) => {
  if (!replace) return <span>{origin}</span>;
  const html: string = origin.replace(replace, `<strong>${replace}</strong>`);
  return <span dangerouslySetInnerHTML={{ __html: html }}></span>;
};

export default ChangeToHTML;
