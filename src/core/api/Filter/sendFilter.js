import { sendPostRequest, sendpostRequest } from "../api";


export const sendFilterPost = (data) => {
    console.log("data:(sendFilter.js)");
    console.log(data);
    return(
        sendPostRequest({
            url: `https://localhost:44373/api/event/filter?PageNumber=${data.PageNumber}&PageSize=${data.PageSize}`,
            data : data,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }

        })
    )
}
