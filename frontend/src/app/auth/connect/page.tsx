import Bummer404 from "@/components/auth/Bummer404";
import PortMafiaOAuthScreen from "@/components/auth/connect/PortMafiaOAuthScreen";

type PageProps = {
    searchParams: Promise<{
        app: string,
        callbackUrl: string,
        redirectTo: string
    }>
}

const ConnectApp = async ({ searchParams }: PageProps) => {
    const { app, callbackUrl, redirectTo } = await searchParams;

    switch (app as ValidApp) {
        case "the-port-mafia":
            return <PortMafiaOAuthScreen callbackUrl={callbackUrl} redirectTo={redirectTo} />;
        default:
            return <Bummer404 />
    }
}

export default ConnectApp
