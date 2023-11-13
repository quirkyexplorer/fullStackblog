const Notification = ({ message, isError }) => {
  // console.log(message)
  if(isError) {
    return  (
      <div className="error">
        {message}
      </div>
    );
  }

  return  (
    <div className="newContact">
      {message}
    </div>
  );
};

export default Notification;