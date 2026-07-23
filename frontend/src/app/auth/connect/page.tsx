import PortMafiaOAuthScreen from "@/components/auth/connect/PortMafiaOAuthScreen";
import Bummer404 from "@/components/auth/Bummer404";

type PageProps = {
    searchParams: Promise<{
        app: string,
        callbackUrl: string,
        redirectTo: string
        state: string
    }>
}

const ConnectApp = async ({ searchParams }: PageProps) => {
    const { app, callbackUrl, redirectTo, state } = await searchParams;

    switch (app as ValidApp) {
        case "the-port-mafia":
            return <PortMafiaOAuthScreen callbackUrl={callbackUrl} redirectTo={redirectTo} state={state} />;
        default:
            return <Bummer404 />
    }
}

export default ConnectApp
