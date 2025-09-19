

// export const URL="http://localhost:5555"; 
export const URL="https://api.scitoracademy.com";

 export const createAxiosConfig = (isFileUpload = false) => ({
    headers: {
        "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
    },
    withCredentials: true,
});

export const config ={
    headers :{
        "Content-Type": "application/json",
    },
    withCredentials:true
}