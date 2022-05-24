import StatusWithImage from "./StatusWithImage";
import { ReactComponent as SVG } from "../../assets/undraw_server_down_s4lk.svg";

const ServerDown: React.FC = () => (
  <StatusWithImage message="Unable to connect to server">
    <SVG />
  </StatusWithImage>
);

export default ServerDown;
