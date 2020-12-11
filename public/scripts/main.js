(function () {
  const authForm = document.querySelector("#authForm");
  const loginInput = document.querySelector("#loginInput");
  const passwordInput = document.querySelector("#passwordInput");

  async function onSubmit(e) {
    e.preventDefault();

    if (loginInput.value.length && passwordInput.value.length) {
      await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: loginInput.value,
          password: passwordInput.value,
        }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (!body.success) {
            M.toast({ html: `${body.msg}` });
          } else if (body.success) {
            window.location.replace("/admin");
          }
        })
        .catch((err) => {
          console.log(`Something went wrong: ${err}`);
        });
    }
  }

  if (authForm) authForm.addEventListener("submit", onSubmit);
})();

function initCheckAuthor() {
  const author = document.cookie.split("=")[1];
  const slideOut = document.querySelector("#slide-out");

  if (author !== undefined) {
    if (slideOut) slideOut.innerHTML = `
        <li>
          <center>
            <h5>
              <b>${author.split("%23").join("#")}</b>  
            </h5>
          </center>
        </li>
        
        <li>
          <div class="divider"></div>
        </li>
        
        <li>
            <a class="openModal" style="background: rgba(0,0,0,0.03);"><b><i>Add post</i></b></a>    
        </li>
        
      `;

    document.body.innerHTML += ` 
      <div class="modal_cus alms-s" id="modalAddPost" style="overflow-y: scroll; "> 
        <div class="closepanel"></div>
          <div class="Iname p15 d-flex jcc  f-col " style="margin-top: 45px; margin-bottom: 45px;">
            <form action="/posts/createpost" method="post">
            <p><b>Post Img : </b></p>
                <center> <img src="https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg" id="imgPost" style="max-width: 500px;" alt="post img"></center>
                 <div class="row">
                        <div class="input-field col s12">
                          <input id="title" type="text" name="title" class="validate black_cus" required minlength="3">
                          <label for="title" class="black_cus">Title</label>
                        </div>
                      </div>   
                      
                     <div class="row">
                        <div class="input-field col s12">
                          <input id="imgLink" type="text" name="img" class="validate black_cus" value="https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg">
                          <label for="imgLink" class="black_cus">Img</label>
                        </div>
                      </div> 
                         <div class="row">
                         <p><b>Post content in markdown : </b></p>
                        <div class="input-field col s12">
                          <textarea style="min-height: 300px" placeholder="# content"  type="text" name="content" id="content" class="validate black_cus" value="https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg"> </textarea>
                        </div>
                      </div> 
                      
                            <div class="d-flex jcc">
                <button class="waves-effect waves-light btn">Send for verification and publish</button>
              </div>
                    <div class="example"></div>
                      
      
        
            </form>
            
        </div>
      </div>
     `;

    const imgPost = document.querySelector("#imgPost");
    const imgLink = document.querySelector("#imgLink");

    imgLink.addEventListener("input", (e) => {
      imgPost.setAttribute("src", e.target.value);
    });
  } else {
    slideOut.innerHTML = `<li> <center><button class="waves-effect btn openModal">Introduce yourself and create</button> </center></li>`;
    document.body.innerHTML += ` 
              <div class="modal_cus" id="modal">
                <div class="closepanel"></div>
                  <div class="Iname p15 d-flex jcc  f-col">
                    <h4 align="center">Introduce yourself and create</h4>
                    <form action="/posts/auth" method="post">
                      
                      <div class="row">
                        <div class="input-field col s12">
                          <input id="Author" type="text" name="author" class="validate black_cus" required maxlength="20" minlength="3">
                          <label for="Author" class="black_cus">Author name</label>
                        </div>
                      </div>
              
                      <div class="d-flex jcc">
                        <button class="waves-effect waves-light btn">Introduce yourself</button>
                      </div>
                    </form>
                </div>
              </div>
     `;
  }
}

function initContentLoader() {
  const collapsible = document.querySelectorAll(".collapsible");
  if (collapsible) M.Collapsible.init(collapsible);

  const collapsibleHeaders = document.querySelectorAll(".collapsible-header");
  const collapsibleBodys = document.querySelectorAll(".collapsible-body");
  let currentCollapsibleBody;

  if (collapsibleHeaders) {
    for (let collapsibleHeader of collapsibleHeaders) {
      collapsibleHeader.addEventListener("click", (e) => {
        const postId = e.target.dataset.postid;
        const isOpen = e.target.dataset.isopen;

        if (!postId) {
          return;
        }

        if (isOpen === "false") {
          for (let collapsibleBody of collapsibleBodys) {
            if (collapsibleBody.dataset.postid === postId) {
              currentCollapsibleBody = collapsibleBody;
            }
          }

          currentCollapsibleBody.innerHTML = `<div class="progress"><div class="indeterminate"></div></div>`;

          fetch("/getpostcontent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId }),
          })
            .then((i) => i.json())
            .then(({ content: [{ content }] }) => {
              e.target.setAttribute("data-isOpen", true);
              markdownConverterAndPutToHtml(content, currentCollapsibleBody);

              const viewCountHtml = collapsibleHeader.querySelector("#view")

              fetch('/posts/view', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({ postId }),
              }).then(() => viewCountHtml.innerText = parseInt(viewCountHtml.innerText) + 1 )
            });
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const contentBodyS = document.querySelectorAll(".collapsible-body");
  if (contentBodyS) toMarkdownForAllCB(contentBodyS);

  const sidebar = document.querySelectorAll(".sidenav");
  if (sidebar) M.Sidenav.init(sidebar);

  initCheckAuthor();
  initContentLoader();
  initModal();

  const content = document.querySelector("#content");
  const example = document.querySelector(".example");
  content.addEventListener("keyup", (e) => {
    markdownConverterAndPutToHtml(e.target.value, example);
  });
});

let isOpenModal = false;

function initModal() {
  const openModal = $(".openModal");
  const modal = $("#modal");
  const modalAddPost = $("#modalAddPost");
  const closepanel = $(".closepanel");

  closepanel.on("click", () => {
    if (Object.keys(modal).length) modalLogi(modal);
    else modalLogi(modalAddPost);
  });

  openModal.on("click", () => {
    if (Object.keys(modal).length) modalLogi(modal);
    else modalLogi(modalAddPost);
  });

  function modalLogi(thismo) {
    if (isOpenModal) {
      isOpenModal = false;
      thismo.removeClass("active_modal");
      thismo.animate({ opacity: 0 });
      document.body.style.overflow = "scroll";
    } else {
      isOpenModal = true;
      thismo.addClass("active_modal");
      thismo.animate({ opacity: 1 });
      document.body.style.overflow = "hidden";
    }
  }
}

function markdownConverterAndPutToHtml(content, to) {
  const converter = new showdown.Converter();

  to.innerHTML = converter.makeHtml(content);
}

function toMarkdownForAllCB(cbs) {
  const converter = new showdown.Converter();

  for (let i of cbs) {
    i.innerHTML = converter.makeHtml(i.innerText);
  }
}
