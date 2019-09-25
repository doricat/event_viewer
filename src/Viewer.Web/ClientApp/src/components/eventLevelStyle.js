export const getStyle = (level) => {
    let style;

    switch (level) {
        case "Critical":
            style = "primary";
            break;
        case "Error":
            style = "danger";
            break;
        case "Warning":
            style = "warning";
            break;
        case "Info":
        case "Information":
            style = "info";
            break;
        case "Debug":
            style = "secondary";
            break;
        case "Trace":
            style = "dark";
            break;
        default:
            throw new Error();
    }

    return style;
};