    let check = true
    let message = ""
    let bg = ""
    let border = ""
//------infiniteScroll -------//

let currentPage = 1
let lastPage = 1
setTimeout(() => {
    setUpNavBar()
}, 1)

function getPosts(reload = true, page = 1) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${page}`)
        .then((response) => {
            lastPage = response.data.meta.last_page
            if (reload) {
                document.getElementById("posts").innerHTML = ""
            }
            for (post of response.data.data) {
                const Author = post.author
                let postTitle = ""
                const user = getCurrentUser()
                const isMyPost = user != null && post.author.id == user.id
                let editBtnContent = ``
                let deleteBtnContent = ``
                if(isMyPost)
                {
                    editBtnContent = `<button id="edit-btn" class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Edit</button>`
                    deleteBtnContent = `<button id="delete-btn" class="btn btn-danger" style="float: right; margin-left:1%;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Delete</button>`
                }
                if (post.title != null) {
                    postTitle = post.title
                }
                const content = `
            <div class="post">
                 <div class="card shadow card-mutual "  style="max-width: 100%; ">
                    <div class="card-header">
                         <img src="images/profile.webp" >
                         <b class="profile-name">@${Author.username}</b>
                         ${deleteBtnContent}
                         ${editBtnContent}
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" >
                        
                        <img src="${post.image}"  alt="Post Image" style="width:100%;" class="image-slide" >
                        <p class="card-text"><small class="text-muted">${post.created_at}</small></p>
                        <h5 class="card-title">${postTitle}</h5>
                        <p class="card-text">${post.body}</p>
                        <div class="line"></div>
                        <p class="comment"><i class=" fa fa-light fa-pen-clip"></i> (${post.comments_count}) Comments</p>
                    </div>
                </div>
            </div> `
                document.getElementById("posts").innerHTML += content
            }
        })
}
getPosts()

function loginBtnClick() {
    const username = document.getElementById("username-name").value
    const password = document.getElementById("password-text").value
    
    const baseUrl = "https://tarmeezacademy.com/api/v1/login"
    const parms = {
        "username": username,
        "password": password
    }
    axios.post(baseUrl, parms)
        .then((response) => {
            check = true
            messageLogin = "Logged in successfully"
            bg = "#dff0d8"
            border = "2px solid green"
            let token = response.data.token
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            let modal = document.getElementById("login-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showMessage(check, messageLogin, bg, border)
            setUpNavBar()

        })
        .catch((error) => {
            check = false
            message = "Invalid login, please try again"
            bg = "#e5a1a1"
            border = "2px solid red "
            showMessage(check, message, bg, border)
        })
}

function registerBtnClick() {
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    // const image = document.getElementById("register-image-input").files[0]
    
    const baseUrl = "https://tarmeezacademy.com/api/v1/register"

    let formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)
    // formData.append("image", image)
    formData.append("name", name)

    const headers = {
        "Content-Type": "multipart/form-data"
    }
    axios.post(baseUrl, formData, {
        "headers": headers
    })
        .then((response) => {
            // console.log(response.data.profile_image)
            check = true
            message = "New User Register successfully"
            bg = "#dff0d8"
            border = "2px solid green "
            let token = response.data.token
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            let modal = document.getElementById("register-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showMessage(check, message, bg, border)
            setUpNavBar()

        }).catch((error) => {
            check = false
            if (name == "") {
                message = error.response.data.errors.name[1]
            }
            else {
                message = "The username has already been taken"
            }
            bg = "#e5a1a1"
            border = "2px solid red "
            showMessage(check, message, bg, border)
        })


}
function showMessage(check, message, bg, border) {
    if (check) {
        alertMessage(message, bg, border)
    }
    else {
        alertMessage(message, bg, border)
    }
}

function alertMessage(message, bg, border) {
    document.getElementById("alert-message").classList.add("show-message")
    document.getElementById("alert-message").innerHTML = message
    document.getElementById("alert-message").style.backgroundColor = bg
    document.getElementById("alert-message").style.border = border
    const addPostBtn = document.getElementById("add-post")
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log("setTimeout");
            document.getElementById("alert-message").classList.remove("show-message")
            document.getElementById("alert-message").innerHTML = ""
            resolve();
        }, 2500)
    }).then(function () {
        console.log("done")
        console.log(message)
        if (message == "Logged in successfully")
            addPostBtn.style.display = "block"
        else {
            console.log("inner else")
        }
    })

}

function setUpNavBar() {
    const token = localStorage.getItem("token")
    const loginBtn = document.getElementById("login-btn")
    const registerBtn = document.getElementById("register-btn")
    const logOutDiv = document.getElementById("logout-div")
    const addPostBtn = document.getElementById("add-post")
    const showDataUser = document.getElementById("show-data-username")
    if (token == null) {
        if (addPostBtn != null) {
            addPostBtn.style.display = "none"
        }
        loginBtn.style.setProperty("display", "block", "important")
        registerBtn.style.setProperty("display", "block", "important")
        logOutDiv.style.display = "none"
        showDataUser.style.display = "none"
        if(id!=null){
            document.getElementById("addComment").style.display = "none"
            document.getElementById("delete-btn").style.display = "none"
            document.getElementById("edit-btn").style.display = "none"
            
        }
        getPosts()
        
    }
    else {
        loginBtn.style.setProperty("display", "none", "important")
        registerBtn.style.setProperty("display", "none", "important")
        logOutDiv.style.display = "block "
        const usernameNav = document.getElementById("show-username")
        usernameNav.innerHTML = `@ ${getCurrentUser().username}`
        showDataUser.style.display = "block"
        const user = getCurrentUser()
        document.getElementById("img-username").src = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
        // document.getElementById("img-username").src = user.profile_image
        if(id != null){
        document.getElementById("addComment").style.display = "block"
        document.getElementById("delete-btn").style.display = "block"
        document.getElementById("edit-btn").style.display = "block"
        }
        getPosts()
    }
}

function logOut() {
    check = false
    message = "Logged out successfully"
    bg = "#dff0d8"
    border = "2px solid green "
    document.getElementById("alert-message").classList.remove("show-message")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLogin")
    setUpNavBar()
    showMessage(check, message, bg, border)

}

function createNewPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == "";
    const title = document.getElementById("addPost-title-input").value
    const contentPost = document.getElementById("content-input").value
    const image = document.getElementById("post-image-input").files[0]
    let url = ''
    let check = true
    let formData = new FormData();
    formData.append("body", contentPost)
    formData.append("title", title)
    formData.append("image", image)
    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`
    }
    if(isCreate)
    {
        url='https://tarmeezacademy.com/api/v1/posts'
        axios.post(url, formData, {
            "Content-Type": "multipart/form-data",
            headers: headers
        })
        .then((response) => {
                message = "Post created successfully"
                check = true
                bg = "#dff0d8"
                border = "2px solid green"
                let modal = document.getElementById("addPost-modal")
                let modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showMessage(check, message, bg, border)
                getPosts()
                
            })
            .catch((error) => {
                if(isCreate)
                {
                    check = false
                    if (title == "") {
                        message = "The title box is required"
                    }
                    else if ((contentPost) == "") {
                        message = "The post content is required "
                    }
                    else {
                        console.log("error")
                        console.log(error)
                        message = "error in image"
                    }
                    bg = "#e5a1a1"
                    border = "2px solid red "
                    showMessage(check, message, bg, border)
                }
            })
            
            
    }else{
        formData.append("_method", "put")
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
        axios.post(url, formData, {
            "Content-Type": "multipart/form-data",
            headers: headers
        })
        .then((response) => {
            message = "Post updated successfully"
            check = true
            bg = "#dff0d8"
            border = "2px solid green"
            let modal = document.getElementById("addPost-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showMessage(check, message, bg, border)
            getPosts()
            if(id != null)
            {
                window.location.reload()
                editPostBtnClicked()
            }
        })
        
        

    }
    
       

}
function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user")
    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user
}
function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}
const urlParms = new URLSearchParams(window.location.search)
const id = urlParms.get("postId")


function getPost() {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then((response) => {
            // document.getElementById("post").innerHTML = ""
            const post_user = response.data.data
            const comments = post_user.comments
            const author = post_user.author
            document.getElementById("username-span").innerHTML = author.username
            let commentsContent = ``
            for(currentComment of comments){
                
                commentsContent += 
                `<div class="card-header">
                    <img src="images/profile.webp" alt="" style="margin-bottom: 10px;">
                    <b>${currentComment.author.username}</b>
                    <p id="commentBody">${currentComment.body}</p>
                </div>
                <div id="comment">
                    <hr>
                </div>`
                
            }
            const user = getCurrentUser()
                const isMyPost = user != null && post_user.author.id == user.id
                let editBtnContent = ``
                let deleteBtnContent = ``
                if(isMyPost)
                {
                    editBtnContent = `<button id="edit-btn" class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post_user))}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Edit</button>`
                    deleteBtnContent = `<button id="delete-btn" class="btn btn-danger" style="float: right; margin-left:1%;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post_user))}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Delete</button>`
                }
            const postContent = `
                        <div class="card shadow card-mutual "  style="max-width: 100%; " id="post" target="_blank">
                            <div class="card-header">
                                <img src="images/profile.webp" >
                                <b class="profile-name">@${author.username}</b>
                                ${deleteBtnContent}
                                ${editBtnContent}
                            </div>
                            <div class="card-body" >
                                
                                <img src="${post_user.image}"  alt="Post Image" style="width:100%;" class="image-slide" >
                                <p class="card-text"><small class="text-muted">${post_user.created_at}</small></p>
                                <h5 class="card-title">${post_user.title}</h5>
                                <p class="card-text">${post_user.body}</p>
                                <div class="line"></div>
                                <p class="comment"><i class=" fa fa-light fa-pen-clip"></i> (${post_user.comments_count}) Comments</p>
                                <div class="line"></div>
                            </div>
                            
                            
                                <div id="commentPost" class=" col-9 " style="background: #e5e1f5;">
                                    ${commentsContent}
                                </div>
                                    
                                    <div class="addComment" id="addComment" >
                                        <input type="text" placeholder="add your comment..." id="comment-input">
                                        <button type="button" id="sendComment"  class="btn btn-outline-primary" onclick="createCommentClicked()">send</button>
                                        </div>
                        </div>
                    `
            document.getElementById("post").innerHTML += postContent
            setUpNavBar()
        })
}
getPost()

function createCommentClicked(){
   const commentBody = document.getElementById("comment-input").value
    let param = {
        "body": commentBody
    }
    let token = localStorage.getItem("token")
    let url = `https://tarmeezacademy.com/api/v1/posts/${id}/comments`
    axios.post(url,param,{
        headers : {
            "authorization": `Bearer ${token}`
        }
    })
    .then((response) =>{
        document.getElementById("post").innerHTML = ""
        message = "The comment has been created successfully"
        check = true
        bg = "#dff0d8"
        border = "2px solid green"
        showMessage(check,message,bg,border)
        getPost()
        
    })
    .catch((error)=>{
        check = false
        message = error.response.data.message
        bg = "#e5a1a1"
        border = "2px solid red "
        showMessage(check,message,bg,border)
    })
}

function addPostBtnClicked(){
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("addPost-title-input").value = ""
    document.getElementById("content-input").value = ""
    document.getElementById("createBtn").innerHTML = "Create"
    let postModal = new bootstrap.Modal(document.getElementById("addPost-modal"),{})
    postModal.toggle()
}
function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("addPost-title-input").value = post.title
    document.getElementById("content-input").value = post.body
    document.getElementById("createBtn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("addPost-modal"),{})
    postModal.toggle()
}
function deletePostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    // alert("delete")
    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("deletePost-modal"),{})
    postModal.toggle()
}

function deletePost (){
    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`
    }
    const postId = document.getElementById("delete-post-id-input").value
    
    url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    axios.delete(url, {
        headers: headers
    })
    .then((response) => {
        message = "Post Deleted successfully"
        check = true
        bg = "#dff0d8"
        border = "2px solid green"
        let modal = document.getElementById("deletePost-modal")
        let modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showMessage(check, message, bg, border)
        getPosts()
        if(id != null){
            window.open("index.html")    
        }
    })
}
