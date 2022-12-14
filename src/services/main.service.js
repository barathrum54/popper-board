import { useHttps } from "@/config/http.js";


const savePopper = async (data) => {
    const https = useHttps();
    data = encodeURIComponent(JSON.stringify(data.objects));
    const response = await https.post("/popper", `data=${data}`);

    return response;
};
export {
    savePopper
};