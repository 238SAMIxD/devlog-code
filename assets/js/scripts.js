const postButton = document.querySelector(".login-clean [type=submit]");
const postsContainer = document.querySelector(".posts");
const postContent = document.querySelector(".content");
const authorName = document.querySelector(".author-name");
const contactStatus = document.querySelector("#contactForm #success");

(function() {
	"use strict"; // Start of use strict

	// Show the navbar when the page is scrolled up
	var MQL = 992;
	var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	var mainNav = document.querySelector('#mainNav');

	//primary navigation slide-in effect
	if (mainNav && vw > MQL) {
		let headerHeight = mainNav.offsetHeight;
		let previousTop = window.pageYOffset;

		window.addEventListener('scroll', function() {
			let currentTop = window.pageYOffset;
			//check if user is scrolling up
			if (currentTop < previousTop) {
				//if scrolling up...
				if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
					mainNav.classList.add('is-visible');
				} else {
					mainNav.classList.remove('is-visible', 'is-fixed');
				}
			} else if (currentTop > previousTop) {
				//if scrolling down...
				mainNav.classList.remove('is-visible');

				if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
					mainNav.classList.add('is-fixed');
				}
			}
			previousTop = currentTop;
		});
	}
})(); // End of use strict

window.onresize = setTitle;

function setTitle() {
    if ( window.innerWidth < 510 ) {
        document.querySelector(".navbar-brand").innerHTML = "Welcome to the University:<br />Student's Revenge";
    } else {
        document.querySelector(".navbar-brand").innerHTML = "Welcome to the University: Student's Revenge";
    }
}

setTitle();

if( postButton ) postButton.onclick = postDevlog;

if( postsContainer ) getDevlogs();

if( postContent ) getDevlog();

if( authorName ) getAuthorDevlogs();

if( contactStatus ) getStatus();

async function postDevlog( e ) {
    e.preventDefault();
    
    const form = document.querySelector("form");
    const data = new FormData( form );
    const images = document.querySelector("[type=file]");
    
    const params = {
        "method": "post",
        "body": data
    }
    data.append( "files", images.files );
    
    fetch( "https://zgrajsie.com/devlog/dev", params )
        .then( response => response.json() )
        .then( json => {
            const result = document.querySelector(".result");
        
            if( json.status != 200 ) {
                result.classList.remove( "text-success" );
                result.classList.add( "text-danger" );
                result.innerText = json.message;
                result.style.display = "block";
                return;
            }
        
            result.classList.remove( "text-danger" );
            result.classList.add( "text-success" );
            result.innerText = json.message;
            result.style.display = "block";
        
            data.append( "id", json.id );
        
            postDevlogDiscord( serializeForm( data ) );
        });
}

async function postDevlogDiscord( data ) {
    const url = `https://devlog.zgrajsie.com/post.html?title=${data.title.replace(/[ #$<>+%!`&*'"|{}?=/\:@]/g, '-')}&id=${data.id}`;
	const logoFull = "https://devlog.zgrajsie.com/assets/img/logoFull.png";
	const logoDiscord = "https://devlog.zgrajsie.com/assets/img/logoDiscord.png";
	const logoZgrajSie = "https://devlog.zgrajsie.com/assets/img/logoZgrajSie.png";
	const emojiLaptop = "https://devlog.zgrajsie.com/assets/img/emojiLaptop.png";
	const webhook = "WEBHOOK URL";
    const params = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "content": `@everyone\n\n**Devlog #${data.id}**`,
            "embeds": [
            {
                "type": "rich",
                "title": data.title,
                "description": data.subtitle,
                "color": 0xf1f7fc,
                "image": {
                    "url": logoFull,
                    "height": 0,
                    "width": 0
                },
                "thumbnail": {
                    "url": logoDiscord,
                    "height": 0,
                    "width": 0
                },
                "author": {
                    "name": `Welcome to the University: Student's Revenge`,
                    "url": `https://devlog.zgrajsie.com`,
                    "icon_url": logoZgrajSie
                },
                "footer": {
                    "text": `Posted by ${data.author} on ${new Date().toLocaleString()}`,
                    "icon_url": emojiLaptop
                },
                "url": url
            }
            ]
        })
    };
    
    fetch( webhook, params );
}

async function getDevlogs() {
    const offset = document.querySelectorAll(".post-preview.post").length;
    const placeholders = document.querySelectorAll(".post-placeholder");
    
    fetch(`https://zgrajsie.com/devlog/posts?offset=${offset}`)
        .then( response => response.json() )
        .then( json => {
            const result = document.querySelector(".result");
        
            if( json.status != 200 ) {
                result.classList.add( "text-danger" );
                result.innerText = json.message;
                result.style.display = "block";
                return;
            }
        
            placeholders.forEach( placeholder => {
                placeholder.nextElementSibling.remove();
                placeholder.remove();
            });
        
            json.data.forEach( post => {
                const postPreview = document.createElement("div");
                const aMain = document.createElement("a");
                const postTitle = document.createElement("h2");
                const postSubtitle = document.createElement("h3");
                const postMeta = document.createElement("p");
                const postAuthor = document.createElement("a");
                const postTime = document.createElement("time");
                const postViews = document.createElement("span");
                
                postPreview.className = "post-preview post";
                aMain.href = `post.html?title=${post.title.replace(/[ #$<>+%!`&*'"|{}?=/\:@]/g, '-')}&id=${post.id}`;
                postTitle.innerText = post.title;
                postSubtitle.innerText = post.subtitle;
                postMeta.className = "post-meta";
                postAuthor.href = `author.html?name=${post.author}`;
                postAuthor.innerText = post.author;
                postTime.dateTime = "DD.MM.YYYY hh:mm:ss";
                postTime.innerText = post.time;
                postViews.className = "float-end";
                postViews.innerText = `Views: ${post.views}`;
                postMeta.append( "Posted by: ", postAuthor, " on ", postTime, postViews );
                
                aMain.append( postTitle, postSubtitle );
                postPreview.append( aMain, postMeta );
                
                postsContainer.appendChild( postPreview );
            });
        
            const postsCount = document.querySelectorAll(".post-preview.post").length;
            const loadDevlogsButton = document.querySelector("button[type=button]");
        
            if( postsCount === 0 || postsCount % 4 !== 0 ) loadDevlogsButton.style.display = "none";
        
            loadDevlogsButton.disabled = false;
        
            if( postsCount === 0)  {
                result.innerText = "No posts to show.";
                result.style.display = "block";
            }
        });
}

async function getDevlog() {
    const title = document.querySelector("h1");
    const subtitle = document.querySelector("h2");
    const metaA = document.querySelector(".meta a");
    const metaTime = document.querySelector(".meta time");
    const getTitle = new URL( window.location.href ).searchParams.get("title");
    const getId = new URL( window.location.href ).searchParams.get("id");
    const views = document.querySelector(".views");
    const converter = new showdown.Converter();
    
    fetch(`https://zgrajsie.com/devlog/post?title=${getTitle}&id=${getId}`)
        .then( response => response.json() )
        .then( json => {
            if( json.status != 200 ) {
                window.location = "../";
                return;
            }
        
            const data = json.data;
			
			document.title = `${data.title} Devlog - Welcome to the University: Student's Revenge`;
        
            title.innerText = data.title;
            subtitle.innerText = data.subtitle;
            metaA.href = `author.html?name=${data.author}`;
            metaA.innerText = data.author;
            metaTime.innerText = data.time;
            postContent.innerHTML = converter.makeHtml( data.text );
            views.innerText = `Views: ${data.views}`;
        });
}

async function getAuthorDevlogs() {
    const name = new URL( window.location.href ).searchParams.get("name");
    const offset = document.querySelectorAll(".post-preview.post").length;
    const placeholders = document.querySelectorAll(".post-placeholder");
    const postsAuthorContainer = document.querySelector(".postsAuthor");
    
    fetch(`https://zgrajsie.com/devlog/author?name=${name}&offset=${offset}`)
        .then( response => response.json() )
        .then( json => {
            const result = document.querySelector(".result");
        
            if( json.status != 200 ) {
                result.classList.add( "text-danger" );
                result.innerText = json.message;
                result.style.display = "block";
                return;
            }
        
            placeholders.forEach( placeholder => {
                placeholder.nextElementSibling.remove();
                placeholder.remove();
            });
        
            authorName.innerText = name;
			
			document.title = `${name} Author - Welcome to the University: Student's Revenge`;
        
            json.data.forEach( post => {
                const postPreview = document.createElement("div");
                const aMain = document.createElement("a");
                const postTitle = document.createElement("h2");
                const postSubtitle = document.createElement("h3");
                const postMeta = document.createElement("p");
                const postAuthor = document.createElement("a");
                const postTime = document.createElement("time");
                const postViews = document.createElement("span");
                
                postPreview.className = "post-preview post";
                aMain.href = `post.html?title=${post.title.replace(/[ #$<>+%!`&*'"|{}?=/\:@]/g, '-')}&id=${post.id}`;
                postTitle.innerText = post.title;
                postSubtitle.innerText = post.subtitle;
                postMeta.className = "post-meta";
                postAuthor.href = `author.html?name=${post.author}`;
                postAuthor.innerText = post.author;
                postTime.dateTime = "DD.MM.YYYY hh:mm:ss";
                postTime.innerText = post.time;
                postViews.className = "float-end";
                postViews.innerText = `Views: ${post.views}`;
                postMeta.append( "Posted by: ", postAuthor, " on ", postTime, postViews );
                
                aMain.append( postTitle, postSubtitle );
                postPreview.append( aMain, postMeta );
                
                postsAuthorContainer.appendChild( postPreview );
            });
        
            const postsCount = document.querySelectorAll(".post-preview.post").length;
            const loadDevlogsButton = document.querySelector("button[type=button]");
        
            if( postsCount === 0 || postsCount % 4 !== 0 ) loadDevlogsButton.style.display = "none";
        
            loadDevlogsButton.disabled = false;
        
            if( postsCount === 0)  {
                result.innerText = "No posts to show.";
                result.style.display = "block";
            }
        });
}

function getStatus() {
	const status = new URL( window.location.href ).searchParams.get("success");
	
	if( status == 1 ) {
		contactStatus.className = "text-success";
		contactStatus.innerText = "Success";
	} else if ( status == 0 ) {
		contactStatus.className = "text-danger";
		contactStatus.innerText = "Something went wrong. Try again later";
	}
}

function serializeForm( formData ) {
	let obj = {};
	for ( const key of formData.keys() ) {
		obj[ key ] = formData.get( key );
	}
	return obj;
};