let oti = localStorage.getItem("oti");
let otb = localStorage.getItem("otb");
let returnOption;

if (oti === "" || oti === null || otb === "" || otb === null) {
    returnOption.method = "get";
    returnOption.action = "/login";
    returnOption.submit();
}
