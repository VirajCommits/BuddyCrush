(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[636],{2804:(e,a,t)=>{Promise.resolve().then(t.bind(t,3884))},3884:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>w});var o=t(5155),s=t(8803),i=t.n(s),r=t(2115),l=t(2651),n=t(6046),c=t(8629);function d(e){let{leaderboard:a}=e;return 0===a.length?(0,o.jsx)("p",{style:p.noData,children:"No completions yet."}):(0,o.jsx)("div",{style:p.container,children:(0,o.jsx)("ol",{style:p.list,children:a.map(e=>(0,o.jsxs)("li",{style:p.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:p.avatar}),(0,o.jsxs)("div",{style:p.userInfo,children:[(0,o.jsx)("span",{style:p.userName,children:e.user_name}),(0,o.jsxs)("span",{style:p.completionCount,children:[e.completion_count," completions Viraj"]})]})]},e.user_id))})})}let p={container:{padding:"1px",borderRadius:"8px",maxWidth:"500px"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"decimal",paddingLeft:"3px",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"5px 0"},avatar:{width:"40px",height:"40px",borderRadius:"50%",marginRight:"15px",objectFit:"cover",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column",flex:1},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"5px"},completionCount:{fontSize:"12px",color:"#aaa"}};function x(e){let{activity:a=[]}=e;return Array.isArray(a)&&0!==a.length?(0,o.jsx)("div",{style:m.container,children:(0,o.jsx)("ul",{style:m.list,children:a.map((e,a)=>(0,o.jsxs)("li",{style:m.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:m.avatar}),(0,o.jsxs)("div",{style:m.userInfo,children:[(0,o.jsx)("span",{style:m.userName,children:e.user_name}),(0,o.jsxs)("span",{style:m.completed,children:["Completed"," ",e.days_ago>0?"".concat(e.days_ago," day(s) ago"):"today"]})]})]},a))})}):(0,o.jsx)("p",{style:m.noData,children:"No recent activity."})}let m={container:{borderRadius:"8px",maxWidth:"1000px",margin:"20px auto"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"none",padding:"0",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"10px"},avatar:{borderRadius:"50%",objectFit:"cover",marginRight:"10px",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column"},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"3px"},completed:{fontSize:"12px",color:"#aaa"}};var u=t(1536),g=t(5370);let h=(0,t(1319).io)("https://pal-crush-2c20ca197e75.herokuapp.com",{withCredentials:!0,transports:["websocket"],reconnectionAttempts:5});function y(e){let{groupId:a,currentUser:t,onClose:s}=e,[l,n]=(0,r.useState)([]),[c,d]=(0,r.useState)(""),[p,x]=(0,r.useState)(!0),m=(0,r.useRef)(null);(0,r.useEffect)(()=>{var e;null===(e=m.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},[l]),(0,r.useEffect)(()=>{h.emit("join_group",{group_id:a});let e=e=>{n(a=>[...a,e])};return h.on("group_message",e),()=>{h.emit("leave_group",{group_id:a}),h.off("group_message",e)}},[a]),(0,r.useEffect)(()=>{(async()=>{try{x(!0);let e=await fetch("/api/groups/".concat(a,"/messages"),{credentials:"include"});if(e.ok){let a=await e.json();n(a.messages||[])}}catch(e){console.error("Failed to fetch group messages:",e)}finally{x(!1)}})()},[a]);let u=async()=>{if(c.trim())try{await fetch("/api/groups/".concat(a,"/send-message"),{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({message:c})}),d("")}catch(e){console.error("Failed to send message:",e)}};return p?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"59757a9a75657e2a",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:b.container,className:"jsx-59757a9a75657e2a",children:[(0,o.jsxs)("div",{style:b.header,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)("button",{onClick:s,style:b.closeBtn,className:"jsx-59757a9a75657e2a",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-59757a9a75657e2a",children:"Group Chat"})]}),(0,o.jsx)("div",{style:b.loadingContainer,className:"jsx-59757a9a75657e2a",children:(0,o.jsx)("p",{style:b.loadingText,className:"jsx-59757a9a75657e2a",children:"Loading chat..."})}),(0,o.jsxs)("div",{style:b.skeletonMessagesArea,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)(f,{}),(0,o.jsx)(f,{}),(0,o.jsx)(f,{})]}),(0,o.jsxs)("div",{style:b.inputRow,className:"jsx-59757a9a75657e2a",children:[(0,o.jsx)("input",{style:b.inputDisabled,placeholder:"Loading...",disabled:!0,className:"jsx-59757a9a75657e2a"}),(0,o.jsx)("button",{style:b.sendBtnDisabled,disabled:!0,className:"jsx-59757a9a75657e2a",children:"Send"})]})]})]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"11a770e3a6c80e13",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:b.container,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("div",{style:b.header,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("button",{onClick:s,style:b.closeBtn,className:"jsx-11a770e3a6c80e13",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-11a770e3a6c80e13",children:"Group Chat"})]}),(0,o.jsxs)("div",{style:b.messagesArea,className:"jsx-11a770e3a6c80e13",children:[l.map((e,a)=>{let s=e.user===t;return(0,o.jsxs)("div",{style:s?b.myMessageRow:b.otherMessageRow,className:"jsx-11a770e3a6c80e13",children:[!s&&(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",width:30,height:30,alt:"avatar",style:b.avatar,className:"jsx-11a770e3a6c80e13"}),(0,o.jsxs)("div",{style:b.messageContent,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("div",{style:b.username,className:"jsx-11a770e3a6c80e13",children:e.user}),(0,o.jsx)("div",{style:s?b.myBubble:b.otherBubble,className:"jsx-11a770e3a6c80e13",children:e.message})]}),s&&(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",width:30,height:30,alt:"avatar",style:b.avatar,className:"jsx-11a770e3a6c80e13"})]},a)}),(0,o.jsx)("div",{ref:m,className:"jsx-11a770e3a6c80e13"})]}),(0,o.jsxs)("div",{style:b.inputRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("input",{style:b.input,value:c,onChange:e=>d(e.target.value),placeholder:"Type a message...",className:"jsx-11a770e3a6c80e13"}),(0,o.jsx)("button",{style:b.sendBtn,onClick:u,className:"jsx-11a770e3a6c80e13",children:"Send"})]})]})]})}function f(){return(0,o.jsxs)("div",{style:b.skeletonMessageRow,children:[(0,o.jsx)("div",{style:b.skeletonAvatar}),(0,o.jsx)("div",{style:b.skeletonBubble})]})}let b={container:{height:"300px",display:"flex",flexDirection:"column",fontSize:"14px",backgroundColor:"#1e1e2f",borderRadius:8,overflow:"hidden",border:"1px solid #2a2a3b"},header:{display:"flex",justifyContent:"space-between",backgroundColor:"#2a2a3b",padding:"6px 10px",borderBottom:"1px solid #3a3a4f"},closeBtn:{cursor:"pointer",color:"#fff",border:"none",background:"none",fontSize:"1rem"},messagesArea:{flex:1,overflowY:"auto",padding:"8px"},myMessageRow:{display:"flex",alignItems:"flex-start",justifyContent:"flex-end",marginBottom:"6px"},otherMessageRow:{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",marginBottom:"6px"},messageContent:{display:"flex",flexDirection:"column",maxWidth:"70%"},username:{fontSize:"0.75rem",color:"#ccc",marginBottom:"2px"},myBubble:{backgroundColor:"#007bff",color:"#fff",padding:"6px 10px",borderRadius:12,lineHeight:1.4,textAlign:"right"},otherBubble:{backgroundColor:"#2e3a4b",color:"#fff",padding:"6px 10px",borderRadius:12,lineHeight:1.4,textAlign:"left"},avatar:{borderRadius:"50%",objectFit:"cover",margin:"0 8px"},inputRow:{display:"flex",gap:6,padding:8,backgroundColor:"#2a2a3b",borderTop:"1px solid #3a3a4f"},input:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#2e3a4b",color:"#fff",padding:"6px",outline:"none"},sendBtn:{backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:4,padding:"6px 12px",cursor:"pointer",fontWeight:500},loadingContainer:{display:"flex",justifyContent:"center",alignItems:"center",padding:"16px"},loadingText:{color:"#ccc",fontStyle:"italic"},skeletonMessagesArea:{flex:1,overflowY:"auto",padding:"8px"},skeletonMessageRow:{display:"flex",alignItems:"center",marginBottom:"12px"},skeletonAvatar:{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:"#3a3a4f",animation:"blink 1.2s ease-in-out infinite"},skeletonBubble:{marginLeft:"8px",backgroundColor:"#3a3a4f",height:"16px",width:"40%",borderRadius:"12px",animation:"blink 1.2s ease-in-out infinite"},inputDisabled:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#3a3a4f",color:"#888",padding:"6px",outline:"none"},sendBtnDisabled:{backgroundColor:"#555",color:"#ccc",border:"none",borderRadius:4,padding:"6px 12px",cursor:"not-allowed",fontWeight:500}};function j(e){let{group:a}=e,[t,s]=(0,r.useState)("activity"),[i,l]=(0,r.useState)(!1),[n,c]=(0,r.useState)(""),[p,m]=(0,r.useState)(!0),[h,f]=(0,r.useState)([]),[b,j]=(0,r.useState)([]),[k,C]=(0,r.useState)(""),[w,N]=(0,r.useState)(!1);(0,r.useEffect)(()=>{(async()=>{try{let e=(await (0,g.eO)()).data.user;C(e.email);let t=await (0,g.rl)(a.id);console.log(t),l(t.data.completed)}catch(e){console.error("Error fetching user or habit status:",e),c("Failed to fetch user or habit state.")}})()},[a.id]),(0,r.useEffect)(()=>{(async()=>{m(!0);try{let e=await (0,g.QY)(a.id);j(e.data.activity)}catch(e){console.error("Error fetching activity:",e),c("Failed to fetch activity feed.")}finally{m(!1)}})()},[a.id]),(0,r.useEffect)(()=>{(async()=>{try{let e=await (0,g.kK)(a.id);f(e.data.leaderboard)}catch(e){console.error("Error fetching leaderboard:",e),c("Failed to fetch leaderboard.")}})()},[a.id]);let B=async()=>{m(!0);try{let e=await (0,g.Kr)(a.id);alert(e.message||"Habit completed successfully!"),l(!0),j(e=>{var t;return[...e,{user_picture:null===(t=a.members.find(e=>e.email===k))||void 0===t?void 0:t.user_image,completed_date:new Date().toISOString().split("T")[0],days_ago:0}]}),f(e=>e.map(e=>e.user_email===k?{...e,completion_count:e.completion_count+1}:e))}catch(a){var e,t;console.error("Error completing habit:",a),c((null===(t=a.response)||void 0===t?void 0:null===(e=t.data)||void 0===e?void 0:e.error)||"Failed to complete the daily task.")}finally{m(!1)}};return(0,o.jsxs)("div",{style:v.card,children:[(0,o.jsx)("div",{style:v.topHeader,children:(0,o.jsx)("h3",{style:v.groupName,children:a.name})}),(0,o.jsxs)("div",{style:v.header,children:[(0,o.jsxs)("div",{style:v.tabs,children:[(0,o.jsx)("button",{style:{...v.tabButton,..."activity"===t?v.activeTab:{}},onClick:()=>s("activity"),children:"Activity"}),(0,o.jsx)("button",{style:{...v.tabButton,..."leaderboard"===t?v.activeTab:{}},onClick:()=>s("leaderboard"),children:"Leaderboard"}),(0,o.jsx)("button",{style:{...v.tabButton,..."about"===t?v.activeTab:{}},onClick:()=>s("about"),children:"About"})]}),(0,o.jsx)(u.uN,{style:v.chatIcon,title:"Open Chat",onClick:()=>N(!0)})]}),(0,o.jsx)("div",{style:v.content,children:p?(0,o.jsx)("div",{style:v.loading,children:"Loading..."}):(0,o.jsxs)(o.Fragment,{children:["activity"===t&&(0,o.jsx)(x,{activity:b}),"leaderboard"===t&&(0,o.jsx)(d,{leaderboard:h}),"about"===t&&(0,o.jsxs)("div",{style:v.about,children:[(0,o.jsx)("p",{style:v.description,children:a.description}),(0,o.jsxs)("p",{style:v.totalMembers,children:[a.members.length," members"]}),(0,o.jsx)("div",{style:v.membersList,children:a.members.map(e=>(0,o.jsxs)("div",{style:v.member,children:[(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",alt:"".concat(e.name,"'s avatar"),width:30,height:30,className:"member-avatar"}),(0,o.jsx)("span",{style:v.memberName,children:e.name})]},e.email))})]})]})}),n&&(0,o.jsx)("div",{style:v.error,children:n}),(0,o.jsx)("button",{onClick:B,style:{...v.completeButton,...i?v.completedButton:{}},disabled:i||p,children:i?"Completed Today \uD83C\uDF89":p?"Completing...":"Complete Habit \uD83D\uDE80"}),w&&(0,o.jsx)(y,{groupId:a.id,onClose:()=>N(!1)})]})}let v={topHeader:{marginBottom:"20px"},card:{backgroundColor:"#1c1c1c",borderRadius:"10px",padding:"20px",boxShadow:"0 4px 8px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:"500px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},groupName:{margin:0,color:"#fff"},tabs:{display:"flex",gap:"10px"},tabButton:{padding:"5px 10px",backgroundColor:"#2c2c2c",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"0.9rem",transition:"background-color 0.3s"},activeTab:{backgroundColor:"#007bff"},content:{flex:1,marginBottom:"10px",overflowY:"auto",maxHeight:"350px"},about:{padding:"10px",backgroundColor:"#2c2c3b",borderRadius:"5px"},description:{marginBottom:"10px",color:"#ccc"},totalMembers:{marginBottom:"10px",color:"#ccc",fontWeight:"bold"},membersList:{display:"flex",flexWrap:"wrap",gap:"10px"},member:{display:"flex",alignItems:"center",backgroundColor:"#3c3c3c",padding:"5px 10px",borderRadius:"5px"},memberName:{color:"#fff",fontSize:"0.9rem"},chatIcon:{color:"#007bff",fontSize:"20px",cursor:"pointer",transition:"color 0.3s"},completeButton:{padding:"10px",backgroundColor:"#28a745",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"bold",marginTop:"10px",transition:"background-color 0.3s"},completedButton:{backgroundColor:"#6c757d",cursor:"not-allowed"},error:{color:"red",marginBottom:"10px"},loading:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",color:"#fff",fontSize:"1.2rem"}};var k=t(8173),C=t.n(k);function w(){let e=(0,n.useRouter)(),{data:a,error:t,isLoading:s}=(0,c.I)({queryKey:["profile"],queryFn:async()=>(await l.A.get("/api/profile",{withCredentials:!0})).data.user,staleTime:3e5,gcTime:18e5}),{data:d,error:p,isLoading:x}=(0,c.I)({queryKey:["joinedGroups",null==a?void 0:a.email],queryFn:async()=>((await l.A.get("/api/groups/discover",{withCredentials:!0})).data.groups||[]).filter(e=>e.members.some(e=>e.email===(null==a?void 0:a.email))),enabled:!!a,staleTime:3e5,gcTime:18e5}),m=(0,r.useCallback)(async()=>{try{await l.A.post("/api/logout",{},{withCredentials:!0}),e.push("/")}catch(e){console.error("Logout failed:",e),alert("Logout failed, see console for details.")}},[e]);return t||p?(0,o.jsxs)("div",{style:B.errorMsg,children:["Error: ",(null==t?void 0:t.message)||(null==p?void 0:p.message)]}):s?(0,o.jsx)("div",{style:B.loadingWrapper,children:(0,o.jsx)("p",{style:B.loadingText,children:"Loading profile..."})}):a?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{id:"11a770e3a6c80e13",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:B.pageWrapper,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("header",{style:B.header,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h1",{style:B.logoText,className:"jsx-11a770e3a6c80e13",children:"Buddy Board"}),(0,o.jsx)("div",{style:B.userArea,className:"jsx-11a770e3a6c80e13",children:(0,o.jsx)("img",{src:a.picture||"https://via.placeholder.com/40",alt:"".concat(a.name," avatar"),width:40,height:40,style:B.headerAvatar,className:"jsx-11a770e3a6c80e13"})})]}),(0,o.jsxs)("div",{style:B.container,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("section",{style:B.profileCard,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("h2",{style:B.welcomeText,className:"jsx-11a770e3a6c80e13",children:["Welcome, ",a.name,"!"]}),(0,o.jsx)("img",{src:a.picture||"https://via.placeholder.com/140",alt:"".concat(a.name,"'s avatar"),width:140,height:140,style:B.avatar,className:"jsx-11a770e3a6c80e13"}),(0,o.jsxs)("p",{style:B.emailText,className:"jsx-11a770e3a6c80e13",children:["Email: ",a.email]}),(0,o.jsx)("button",{onClick:m,style:B.logoutButton,className:"jsx-11a770e3a6c80e13",children:"Log Out"})]}),(0,o.jsxs)("section",{style:B.cardRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("div",{style:B.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:B.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Create Group"}),(0,o.jsx)("p",{style:B.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Start a new accountability group to track your habits together!"}),(0,o.jsx)(C(),{href:"/new",style:B.actionButton,children:"Create Group"})]}),(0,o.jsxs)("div",{style:B.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:B.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"}),(0,o.jsx)("p",{style:B.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Join existing groups and find new buddies to crush your goals."}),(0,o.jsx)("a",{href:"/discover",style:B.actionButton,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"})]})]}),(0,o.jsxs)("section",{style:B.groupsSection,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h2",{style:B.subheading,className:"jsx-11a770e3a6c80e13",children:"Your Joined Groups"}),x?(0,o.jsx)(N,{}):(null==d?void 0:d.length)===0?(0,o.jsx)("p",{style:B.noGroupsText,className:"jsx-11a770e3a6c80e13",children:"You have not joined any groups."}):(0,o.jsx)("div",{style:B.groupsGrid,className:"jsx-11a770e3a6c80e13",children:null==d?void 0:d.map(e=>(0,o.jsx)(j,{group:e},e.id))})]})]})]})]}):(0,o.jsx)("div",{style:B.errorMsg,children:"User not found."})}function N(){return(0,o.jsx)("div",{style:B.groupsGrid,children:[void 0,void 0].map((e,a)=>(0,o.jsx)("div",{style:B.skeletonGroupCard},a))})}let B={pageWrapper:{minHeight:"100vh",backgroundColor:"#121212",color:"#EAEAEA",display:"flex",flexDirection:"column",fontFamily:"'Roboto', sans-serif"},header:{backgroundColor:"#1B1B2F",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px"},logoText:{fontSize:"1.8rem",fontWeight:"bold",margin:0},userArea:{display:"flex",alignItems:"center"},headerAvatar:{borderRadius:"50%",objectFit:"cover"},container:{maxWidth:"1100px",margin:"0 auto",padding:"20px",display:"flex",flexDirection:"column",gap:"30px"},profileCard:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"30px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)"},welcomeText:{fontSize:"1.5rem",marginBottom:"20px",fontWeight:"bold"},avatar:{borderRadius:"50%",objectFit:"cover",width:"140px",height:"140px",marginBottom:"20px"},emailText:{marginBottom:"20px",color:"#ccc"},logoutButton:{padding:"10px 20px",backgroundColor:"#FF4B5C",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"bold",transition:"background-color 0.3s ease"},cardRow:{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"},card:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"20px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)",flex:"1 1 250px",maxWidth:"300px"},cardTitle:{fontSize:"1.2rem",fontWeight:"bold",color:"#fff",marginBottom:"10px"},cardDesc:{color:"#ccc",marginBottom:"15px",fontSize:"14px"},actionButton:{display:"inline-block",padding:"10px 18px",backgroundColor:"#007BFF",color:"#fff",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",transition:"background-color 0.3s ease"},groupsSection:{marginTop:"20px"},subheading:{fontSize:"1.4rem",marginBottom:"16px",fontWeight:"bold"},noGroupsText:{color:"#ccc",textAlign:"center",fontSize:"14px"},groupsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"20px"},skeletonGroupCard:{backgroundColor:"#2A2A4A",borderRadius:"10px",height:"120px",animation:"blink 1.2s ease-in-out infinite"},loadingWrapper:{minHeight:"100vh",backgroundColor:"#121212",display:"flex",justifyContent:"center",alignItems:"center"},loadingText:{color:"#ccc",fontSize:"1rem",fontFamily:"sans-serif",fontStyle:"italic"},errorMsg:{color:"red",textAlign:"center",marginTop:"20px",fontSize:"1.2rem"}}},5370:(e,a,t)=>{"use strict";t.d(a,{Kr:()=>l,QY:()=>c,U7:()=>r,eO:()=>s,kK:()=>n,pl:()=>i,rl:()=>d});let o=t(2651).A.create({baseURL:"https://pal-crush-2c20ca197e75.herokuapp.com/api",withCredentials:!0}),s=()=>o.get("/profile"),i=()=>o.get("/groups/discover"),r=e=>o.post("/groups/".concat(e,"/join")),l=e=>o.post("/groups/".concat(e,"/complete")),n=e=>o.get("/groups/".concat(e,"/leaderboard")),c=e=>o.get("/groups/".concat(e,"/activity")),d=e=>o.get("/groups/".concat(e,"/check-habit"))}},e=>{var a=a=>e(e.s=a);e.O(0,[711,651,69,527,412,441,517,358],()=>a(2804)),_N_E=e.O()}]);