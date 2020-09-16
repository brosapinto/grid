import React, { FormEventHandler, useState } from "react";
import useCreateApp from "./useCreateApp";

const CreateApp: React.FC<{ wId: string }> = (props) => {
  const { wId: workspaceId } = props;
  const [createApp, { loading }] = useCreateApp(workspaceId);
  const [name, setName] = useState("");

  const handleSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();
    createApp({ variables: { app: { workspaceId, name } } })
      .then(() => setName(""))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <input
          autoFocus
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          placeholder="Name your App"
        />
        <button>Create</button>
      </fieldset>
    </form>
  );
};

export default CreateApp;
