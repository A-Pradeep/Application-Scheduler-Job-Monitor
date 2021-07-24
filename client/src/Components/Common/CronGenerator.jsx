import Cron from "react-js-cron";
import "antd/dist/antd.min.css";

export default function CronGenerator({ updateCRON }) {
  return (
    <>
      <Cron
        setValue={(e) => {
          updateCRON(e);
        }}
      />
    </>
  );
}
