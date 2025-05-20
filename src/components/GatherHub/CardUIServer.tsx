import CardUIClient from "./CardUIClient";
import { CardUIProps } from "@/lib/gatherHub";

const CardUIServer = (props: CardUIProps) => {
  return <CardUIClient {...props} />;
};

export default CardUIServer;