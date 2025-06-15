import { useRoutes } from "react-router-dom";
import QueryPage from "@/app/query";
// router base for now there is only one route so i don't see the need for it but in feature maybe
const DatabaseRoutes = () => {
    return useRoutes([
      {
        path: '/query',
        element: <QueryPage/>,
      }
  ]);
}
export default DatabaseRoutes;
