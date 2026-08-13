import { faExclamationTriangle } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertDescription, AlertTitle } from "@owl/lib/components/alert";
import { ApiError } from "@/api/fetchWrapper";

export default function AlertError(props: { error?: unknown }) {
      const { error } = props;
      const errorObject =
            error instanceof ApiError
                  ? { status: `Error Code ${error.code}`, message: error.message }
                  : {
                          name: "Unknown Error",
                          message: "There was an error trying to process this request, please try again",
                    };
      console.log(errorObject);

      return (
            <Alert className="bg-red-50 border border-red-400 w-11/12 text-red-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <AlertTitle>{errorObject.status}:</AlertTitle>
                  <AlertDescription className="text-red-950">{errorObject.message}</AlertDescription>
            </Alert>
      );
}
