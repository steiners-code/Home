const REGISTERED_APPS = [
    "the-port-mafia",
    "vendly",
    "times-of-duniya"
] as const;

type ValidApp = typeof REGISTERED_APPS[number];