(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[636],{2804:(e,a,t)=>{Promise.resolve().then(t.bind(t,3884))},3884:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>v});var o=t(5155),s=t(8803),i=t.n(s),r=t(2115),l=t(2651),n=t(6046);function c(e){let{leaderboard:a}=e;return 0===a.length?(0,o.jsx)("p",{style:d.noData,children:"No completions yet."}):(0,o.jsx)("div",{style:d.container,children:(0,o.jsx)("ol",{style:d.list,children:a.map(e=>(0,o.jsxs)("li",{style:d.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:d.avatar}),(0,o.jsxs)("div",{style:d.userInfo,children:[(0,o.jsx)("span",{style:d.userName,children:e.user_name}),(0,o.jsxs)("span",{style:d.completionCount,children:[e.completion_count," completions Viraj"]})]})]},e.user_id))})})}let d={container:{padding:"1px",borderRadius:"8px",maxWidth:"500px"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"decimal",paddingLeft:"3px",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"5px 0"},avatar:{width:"40px",height:"40px",borderRadius:"50%",marginRight:"15px",objectFit:"cover",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column",flex:1},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"5px"},completionCount:{fontSize:"12px",color:"#aaa"}};function p(e){let{activity:a=[]}=e;return Array.isArray(a)&&0!==a.length?(0,o.jsx)("div",{style:x.container,children:(0,o.jsx)("ul",{style:x.list,children:a.map((e,a)=>(0,o.jsxs)("li",{style:x.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:x.avatar}),(0,o.jsxs)("div",{style:x.userInfo,children:[(0,o.jsx)("span",{style:x.userName,children:e.user_name}),(0,o.jsxs)("span",{style:x.completed,children:["Completed"," ",e.days_ago>0?"".concat(e.days_ago," day(s) ago"):"today"]})]})]},a))})}):(0,o.jsx)("p",{style:x.noData,children:"No recent activity."})}let x={container:{borderRadius:"8px",maxWidth:"1000px",margin:"20px auto"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"none",padding:"0",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"10px"},avatar:{borderRadius:"50%",objectFit:"cover",marginRight:"10px",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column"},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"3px"},completed:{fontSize:"12px",color:"#aaa"}};var u=t(1536),m=t(5370);let g=(0,t(1319).io)("http://127.0.0.1:5000",{withCredentials:!0,transports:["websocket"],reconnectionAttempts:5});function h(e){let{groupId:a,onClose:t}=e,[s,l]=(0,r.useState)([]),[n,c]=(0,r.useState)(""),[d,p]=(0,r.useState)(!0);(0,r.useEffect)(()=>{g.emit("join_group",{group_id:a});let e=e=>{l(a=>[...a,e])};return g.on("group_message",e),()=>{g.emit("leave_group",{group_id:a}),g.off("group_message",e)}},[a]),(0,r.useEffect)(()=>{(async()=>{try{p(!0);let e=await fetch("/api/groups/".concat(a,"/messages"),{credentials:"include"});if(e.ok){let a=await e.json();l(a.messages||[])}}catch(e){console.error("Failed to fetch group messages:",e)}finally{p(!1)}})()},[a]);let x=async()=>{if(n.trim())try{await fetch("/api/groups/".concat(a,"/send-message"),{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({message:n})}),c("")}catch(e){console.error("Failed to send message:",e)}};return d?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"59757a9a75657e2a",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:f.container,className:"jsx-59757a9a75657e2a",children:[(0,o.jsxs)("div",{style:f.header,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)("button",{onClick:t,style:f.closeBtn,className:"jsx-59757a9a75657e2a",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-59757a9a75657e2a",children:"Group Chat"})]}),(0,o.jsx)("div",{style:f.loadingContainer,className:"jsx-59757a9a75657e2a",children:(0,o.jsx)("p",{style:f.loadingText,className:"jsx-59757a9a75657e2a",children:"Loading chat..."})}),(0,o.jsxs)("div",{style:f.skeletonMessagesArea,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)(y,{}),(0,o.jsx)(y,{}),(0,o.jsx)(y,{})]}),(0,o.jsxs)("div",{style:f.inputRow,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)("input",{style:f.inputDisabled,placeholder:"Loading...",disabled:!0,className:"jsx-59757a9a75657e2a"}),(0,o.jsx)("button",{style:f.sendBtnDisabled,disabled:!0,className:"jsx-59757a9a75657e2a",children:"Send"})]})]})]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"11a770e3a6c80e13",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:f.container,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("div",{style:f.header,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("button",{onClick:t,style:f.closeBtn,className:"jsx-11a770e3a6c80e13",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-11a770e3a6c80e13",children:"Group Chat"})]}),(0,o.jsx)("div",{style:f.messagesArea,className:"jsx-11a770e3a6c80e13",children:s.map((e,a)=>(0,o.jsxs)("div",{style:f.messageRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",width:30,height:30,alt:"avatar",style:f.avatar,className:"jsx-11a770e3a6c80e13"}),(0,o.jsx)("div",{style:f.bubble,className:"jsx-11a770e3a6c80e13",children:e.message})]},a))}),(0,o.jsxs)("div",{style:f.inputRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("input",{style:f.input,value:n,onChange:e=>c(e.target.value),placeholder:"Type a message...",className:"jsx-11a770e3a6c80e13"}),(0,o.jsx)("button",{style:f.sendBtn,onClick:x,className:"jsx-11a770e3a6c80e13",children:"Send"})]})]})]})}function y(){return(0,o.jsxs)("div",{style:f.skeletonMessageRow,children:[(0,o.jsx)("div",{style:f.skeletonAvatar}),(0,o.jsx)("div",{style:f.skeletonBubble})]})}let f={container:{height:"300px",display:"flex",flexDirection:"column",fontSize:"14px",backgroundColor:"#1e1e2f",borderRadius:8,overflow:"hidden",border:"1px solid #2a2a3b"},header:{display:"flex",justifyContent:"space-between",backgroundColor:"#2a2a3b",padding:"6px 10px",borderBottom:"1px solid #3a3a4f"},closeBtn:{cursor:"pointer",color:"#fff",border:"none",background:"none",fontSize:"1rem"},messagesArea:{flex:1,overflowY:"auto",padding:"8px"},messageRow:{display:"flex",alignItems:"center",marginBottom:"6px"},avatar:{borderRadius:"50%",objectFit:"cover"},bubble:{marginLeft:8,backgroundColor:"#2e3a4b",color:"#fff",padding:"6px 10px",borderRadius:12,maxWidth:"70%",lineHeight:1.4},inputRow:{display:"flex",gap:6,padding:8,backgroundColor:"#2a2a3b",borderTop:"1px solid #3a3a4f"},input:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#2e3a4b",color:"#fff",padding:"6px",outline:"none"},sendBtn:{backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:4,padding:"6px 12px",cursor:"pointer",fontWeight:500},loadingContainer:{display:"flex",justifyContent:"center",alignItems:"center",padding:"16px"},loadingText:{color:"#ccc",fontStyle:"italic"},skeletonMessagesArea:{flex:1,overflowY:"auto",padding:"8px"},skeletonMessageRow:{display:"flex",alignItems:"center",marginBottom:"12px"},skeletonAvatar:{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:"#3a3a4f",animation:"blink 1.2s ease-in-out infinite"},skeletonBubble:{marginLeft:"8px",backgroundColor:"#3a3a4f",height:"16px",width:"40%",borderRadius:"12px",animation:"blink 1.2s ease-in-out infinite"},inputDisabled:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#3a3a4f",color:"#888",padding:"6px",outline:"none"},sendBtnDisabled:{backgroundColor:"#555",color:"#ccc",border:"none",borderRadius:4,padding:"6px 12px",cursor:"not-allowed",fontWeight:500}};function b(e){let{group:a}=e,[t,s]=(0,r.useState)("activity"),[i,l]=(0,r.useState)(!1),[n,d]=(0,r.useState)(""),[x,g]=(0,r.useState)(!0),[y,f]=(0,r.useState)([]),[b,v]=(0,r.useState)([]),[k,C]=(0,r.useState)(""),[w,N]=(0,r.useState)(!1);(0,r.useEffect)(()=>{(async()=>{try{let e=(await (0,m.eO)()).data.user;C(e.email);let t=await (0,m.rl)(a.id);console.log(t),l(t.data.completed)}catch(e){console.error("Error fetching user or habit status:",e),d("Failed to fetch user or habit status.")}})()},[a.id]),(0,r.useEffect)(()=>{(async()=>{g(!0);try{let e=await (0,m.QY)(a.id);v(e.data.activity)}catch(e){console.error("Error fetching activity:",e),d("Failed to fetch activity feed.")}finally{g(!1)}})()},[a.id]),(0,r.useEffect)(()=>{(async()=>{try{let e=await (0,m.kK)(a.id);f(e.data.leaderboard)}catch(e){console.error("Error fetching leaderboard:",e),d("Failed to fetch leaderboard.")}})()},[a.id]);let S=async()=>{g(!0);try{let e=await (0,m.Kr)(a.id);alert(e.message||"Habit completed successfully!"),l(!0),v(e=>{var t;return[...e,{user_picture:null===(t=a.members.find(e=>e.email===k))||void 0===t?void 0:t.user_image,completed_date:new Date().toISOString().split("T")[0],days_ago:0}]}),f(e=>e.map(e=>e.user_email===k?{...e,completion_count:e.completion_count+1}:e))}catch(a){var e,t;console.error("Error completing habit:",a),d((null===(t=a.response)||void 0===t?void 0:null===(e=t.data)||void 0===e?void 0:e.error)||"Failed to complete the daily task.")}finally{g(!1)}};return(0,o.jsxs)("div",{style:j.card,children:[(0,o.jsx)("div",{style:j.topHeader,children:(0,o.jsx)("h3",{style:j.groupName,children:a.name})}),(0,o.jsxs)("div",{style:j.header,children:[(0,o.jsxs)("div",{style:j.tabs,children:[(0,o.jsx)("button",{style:{...j.tabButton,..."activity"===t?j.activeTab:{}},onClick:()=>s("activity"),children:"Activity"}),(0,o.jsx)("button",{style:{...j.tabButton,..."leaderboard"===t?j.activeTab:{}},onClick:()=>s("leaderboard"),children:"Leaderboard"}),(0,o.jsx)("button",{style:{...j.tabButton,..."about"===t?j.activeTab:{}},onClick:()=>s("about"),children:"About"})]}),(0,o.jsx)(u.uN,{style:j.chatIcon,title:"Open Chat",onClick:()=>N(!0)})]}),(0,o.jsx)("div",{style:j.content,children:x?(0,o.jsx)("div",{style:j.loading,children:"Loading..."}):(0,o.jsxs)(o.Fragment,{children:["activity"===t&&(0,o.jsx)(p,{activity:b}),"leaderboard"===t&&(0,o.jsx)(c,{leaderboard:y}),"about"===t&&(0,o.jsxs)("div",{style:j.about,children:[(0,o.jsx)("p",{style:j.description,children:a.description}),(0,o.jsxs)("p",{style:j.totalMembers,children:[a.members.length," members"]}),(0,o.jsx)("div",{style:j.membersList,children:a.members.map(e=>(0,o.jsxs)("div",{style:j.member,children:[(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",alt:"".concat(e.name,"'s avatar"),width:30,height:30,className:"member-avatar"}),(0,o.jsx)("span",{style:j.memberName,children:e.name})]},e.email))})]})]})}),n&&(0,o.jsx)("div",{style:j.error,children:n}),(0,o.jsx)("button",{onClick:S,style:{...j.completeButton,...i?j.completedButton:{}},disabled:i||x,children:i?"Completed Today \uD83C\uDF89":x?"Completing...":"Complete Habit \uD83D\uDE80"}),w&&(0,o.jsx)(h,{groupId:a.id,onClose:()=>N(!1)})]})}let j={topHeader:{marginBottom:"20px"},card:{backgroundColor:"#1c1c1c",borderRadius:"10px",padding:"20px",boxShadow:"0 4px 8px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:"500px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},groupName:{margin:0,color:"#fff"},tabs:{display:"flex",gap:"10px"},tabButton:{padding:"5px 10px",backgroundColor:"#2c2c2c",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"0.9rem",transition:"background-color 0.3s"},activeTab:{backgroundColor:"#007bff"},content:{flex:1,marginBottom:"10px",overflowY:"auto",maxHeight:"350px"},about:{padding:"10px",backgroundColor:"#2c2c3b",borderRadius:"5px"},description:{marginBottom:"10px",color:"#ccc"},totalMembers:{marginBottom:"10px",color:"#ccc",fontWeight:"bold"},membersList:{display:"flex",flexWrap:"wrap",gap:"10px"},member:{display:"flex",alignItems:"center",backgroundColor:"#3c3c3c",padding:"5px 10px",borderRadius:"5px"},memberName:{color:"#fff",fontSize:"0.9rem"},chatIcon:{color:"#007bff",fontSize:"20px",cursor:"pointer",transition:"color 0.3s"},completeButton:{padding:"10px",backgroundColor:"#28a745",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"bold",marginTop:"10px",transition:"background-color 0.3s"},completedButton:{backgroundColor:"#6c757d",cursor:"not-allowed"},error:{color:"red",marginBottom:"10px"},loading:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",color:"#fff",fontSize:"1.2rem"}};function v(){let[e,a]=(0,r.useState)(null),[t,s]=(0,r.useState)([]),[c,d]=(0,r.useState)(!0),[p,x]=(0,r.useState)(""),u=(0,n.useRouter)();(0,r.useEffect)(()=>{(async()=>{try{let e=await l.A.get("/api/profile",{withCredentials:!0});a(e.data.user)}catch(a){var e,t;x((null===(t=a.response)||void 0===t?void 0:null===(e=t.data)||void 0===e?void 0:e.error)||"Failed to fetch profile")}})()},[]),(0,r.useEffect)(()=>{(async()=>{if(e)try{let a=((await l.A.get("/api/groups/discover",{withCredentials:!0})).data.groups||[]).filter(a=>a.members.some(a=>a.email===e.email));s(a)}catch(e){console.error("Error fetching groups:",e)}finally{d(!1)}})()},[e]);let m=async()=>{try{await l.A.post("/api/logout",{},{withCredentials:!0}),u.push("/")}catch(e){console.error("Logout failed:",e),alert("Logout failed, see console for details.")}};return p?(0,o.jsxs)("div",{style:C.errorMsg,children:["Error: ",p]}):e?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"11a770e3a6c80e13",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:C.pageWrapper,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("header",{style:C.header,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h1",{style:C.logoText,className:"jsx-11a770e3a6c80e13",children:"Buddy Board"}),(0,o.jsx)("div",{style:C.userArea,className:"jsx-11a770e3a6c80e13",children:(0,o.jsx)("img",{src:e.picture||"https://via.placeholder.com/40",alt:"".concat(e.name," avatar"),width:40,height:40,style:C.headerAvatar,className:"jsx-11a770e3a6c80e13"})})]}),(0,o.jsxs)("div",{style:C.container,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("section",{style:C.profileCard,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("h2",{style:C.welcomeText,className:"jsx-11a770e3a6c80e13",children:["Welcome, ",e.name,"!"]}),(0,o.jsx)("img",{src:e.picture||"https://via.placeholder.com/140",alt:"".concat(e.name,"'s avatar"),width:140,height:140,style:C.avatar,className:"jsx-11a770e3a6c80e13"}),(0,o.jsxs)("p",{style:C.emailText,className:"jsx-11a770e3a6c80e13",children:["Email: ",e.email]}),(0,o.jsx)("button",{onClick:m,style:C.logoutButton,className:"jsx-11a770e3a6c80e13",children:"Log Out"})]}),(0,o.jsxs)("section",{style:C.cardRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("div",{style:C.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:C.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Create Group"}),(0,o.jsx)("p",{style:C.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Start a new accountability group to track your habits together!"}),(0,o.jsx)("a",{href:"/new",style:C.actionButton,className:"jsx-11a770e3a6c80e13",children:"Create Group"})]}),(0,o.jsxs)("div",{style:C.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:C.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"}),(0,o.jsx)("p",{style:C.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Join existing groups and find new buddies to crush your goals."}),(0,o.jsx)("a",{href:"/discover",style:C.actionButton,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"})]})]}),(0,o.jsxs)("section",{style:C.groupsSection,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h2",{style:C.subheading,className:"jsx-11a770e3a6c80e13",children:"Your Joined Groups"}),c?(0,o.jsx)(k,{}):0===t.length?(0,o.jsx)("p",{style:C.noGroupsText,className:"jsx-11a770e3a6c80e13",children:"You have not joined any groups."}):(0,o.jsx)("div",{style:C.groupsGrid,className:"jsx-11a770e3a6c80e13",children:t.map(e=>(0,o.jsx)(b,{group:e},e.id))})]})]})]})]}):(0,o.jsx)("div",{style:C.loadingWrapper,children:(0,o.jsx)("p",{style:C.loadingText,children:"Loading profile..."})})}function k(){return(0,o.jsx)("div",{style:C.groupsGrid,children:[void 0,void 0].map((e,a)=>(0,o.jsx)("div",{style:C.skeletonGroupCard},a))})}let C={pageWrapper:{minHeight:"100vh",backgroundColor:"#121212",color:"#EAEAEA",display:"flex",flexDirection:"column",fontFamily:"'Roboto', sans-serif"},header:{backgroundColor:"#1B1B2F",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px"},logoText:{fontSize:"1.8rem",fontWeight:"bold",margin:0},userArea:{display:"flex",alignItems:"center"},headerAvatar:{borderRadius:"50%",objectFit:"cover"},container:{maxWidth:"1100px",margin:"0 auto",padding:"20px",display:"flex",flexDirection:"column",gap:"30px"},profileCard:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"30px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)"},welcomeText:{fontSize:"1.5rem",marginBottom:"20px",fontWeight:"bold"},avatar:{borderRadius:"50%",objectFit:"cover",width:"140px",height:"140px",marginBottom:"20px"},emailText:{marginBottom:"20px",color:"#ccc"},logoutButton:{padding:"10px 20px",backgroundColor:"#FF4B5C",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"bold",transition:"background-color 0.3s ease"},cardRow:{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"},card:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"20px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)",flex:"1 1 250px",maxWidth:"300px"},cardTitle:{fontSize:"1.2rem",fontWeight:"bold",color:"#fff",marginBottom:"10px"},cardDesc:{color:"#ccc",marginBottom:"15px",fontSize:"14px"},actionButton:{display:"inline-block",padding:"10px 18px",backgroundColor:"#007BFF",color:"#fff",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",transition:"background-color 0.3s ease"},groupsSection:{marginTop:"20px"},subheading:{fontSize:"1.4rem",marginBottom:"16px",fontWeight:"bold"},noGroupsText:{color:"#ccc",textAlign:"center",fontSize:"14px"},groupsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"20px"},skeletonGroupCard:{backgroundColor:"#2A2A4A",borderRadius:"10px",height:"120px",animation:"blink 1.2s ease-in-out infinite"},loadingWrapper:{minHeight:"100vh",backgroundColor:"#121212",display:"flex",justifyContent:"center",alignItems:"center"},loadingText:{color:"#ccc",fontSize:"1rem",fontFamily:"sans-serif",fontStyle:"italic"}}},5370:(e,a,t)=>{"use strict";t.d(a,{Kr:()=>l,QY:()=>c,U7:()=>r,eO:()=>s,kK:()=>n,pl:()=>i,rl:()=>d});let o=t(2651).A.create({baseURL:"http://127.0.0.1:5000/api",withCredentials:!0}),s=()=>o.get("/profile"),i=()=>o.get("/groups/discover"),r=e=>o.post("/groups/".concat(e,"/join")),l=e=>o.post("/groups/".concat(e,"/complete")),n=e=>o.get("/groups/".concat(e,"/leaderboard")),c=e=>o.get("/groups/".concat(e,"/activity")),d=e=>o.get("/groups/".concat(e,"/check-habit"))}},e=>{var a=a=>e(e.s=a);e.O(0,[711,651,69,976,441,517,358],()=>a(2804)),_N_E=e.O()}]);