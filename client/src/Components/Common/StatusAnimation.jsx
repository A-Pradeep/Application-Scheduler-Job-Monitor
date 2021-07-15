import UseAnimations from "react-useanimations";

const StatusAnimation = ({ statusName, sizename = 50, customFun }) => {
  return (
    <>
      <UseAnimations
        animation={statusName}
        size={sizename}
        onClick={customFun}
      />
    </>
  );
};

export default StatusAnimation;
