(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[636],{2804:(e,t,a)=>{Promise.resolve().then(a.bind(a,3884))},3884:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>w});var o=a(5155),s=a(8803),r=a.n(s),i=a(2115),l=a(2651),n=a(6046),c=a(8629);function d(e){let{leaderboard:t}=e;return 0===t.length?(0,o.jsx)("p",{style:p.noData,children:"No completions yet."}):(0,o.jsx)("div",{style:p.container,children:(0,o.jsx)("ol",{style:p.list,children:t.map(e=>(0,o.jsxs)("li",{style:p.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:p.avatar}),(0,o.jsxs)("div",{style:p.userInfo,children:[(0,o.jsx)("span",{style:p.userName,children:e.user_name}),(0,o.jsxs)("span",{style:p.completionCount,children:[e.completion_count," completions Viraj"]})]})]},e.user_id))})})}let p={container:{padding:"1px",borderRadius:"8px",maxWidth:"500px"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"decimal",paddingLeft:"3px",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"5px 0"},avatar:{width:"40px",height:"40px",borderRadius:"50%",marginRight:"15px",objectFit:"cover",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column",flex:1},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"5px"},completionCount:{fontSize:"12px",color:"#aaa"}};function x(e){let{activity:t=[]}=e;return Array.isArray(t)&&0!==t.length?(0,o.jsx)("div",{style:m.container,children:(0,o.jsx)("ul",{style:m.list,children:t.map((e,t)=>(0,o.jsxs)("li",{style:m.listItem,children:[(0,o.jsx)("img",{src:e.user_picture||"https://via.placeholder.com/40",alt:"".concat(e.user_name,"'s avatar"),width:40,height:40,style:m.avatar}),(0,o.jsxs)("div",{style:m.userInfo,children:[(0,o.jsx)("span",{style:m.userName,children:e.user_name}),(0,o.jsxs)("span",{style:m.completed,children:["Completed"," ",e.days_ago>0?"".concat(e.days_ago," day(s) ago"):"today"]})]})]},t))})}):(0,o.jsx)("p",{style:m.noData,children:"No recent activity."})}let m={container:{borderRadius:"8px",maxWidth:"1000px",margin:"20px auto"},noData:{color:"#ddd",textAlign:"center",fontSize:"14px"},list:{listStyleType:"none",padding:"0",margin:"0"},listItem:{display:"flex",alignItems:"center",padding:"10px"},avatar:{borderRadius:"50%",objectFit:"cover",marginRight:"10px",border:"2px solid #444"},userInfo:{display:"flex",flexDirection:"column"},userName:{fontWeight:"600",fontSize:"14px",color:"#fff",marginBottom:"3px"},completed:{fontSize:"12px",color:"#aaa"}};var u=a(1536),f=a(5370);let g=(0,a(1319).io)("https://pal-crush-2c20ca197e75.herokuapp.com",{withCredentials:!0,transports:["websocket"],reconnectionAttempts:5});function h(e){let{groupId:t,currentUser:a,onClose:s}=e,[l,n]=(0,i.useState)([]),[c,d]=(0,i.useState)(""),[p,x]=(0,i.useState)(!0),m=(0,i.useRef)(null);(0,i.useEffect)(()=>{m.current&&(m.current.scrollTop=m.current.scrollHeight)},[l]),(0,i.useEffect)(()=>{g.emit("join_group",{group_id:t});let e=e=>{n(t=>[...t,e])};return g.on("group_message",e),()=>{g.emit("leave_group",{group_id:t}),g.off("group_message",e)}},[t]),(0,i.useEffect)(()=>{(async()=>{try{x(!0);let e=await fetch("/api/groups/".concat(t,"/messages"),{credentials:"include"});if(e.ok){let t=await e.json();n(t.messages||[])}}catch(e){console.error("Failed to fetch group messages:",e)}finally{x(!1)}})()},[t]);let u=async()=>{if(c.trim())try{await fetch("/api/groups/".concat(t,"/send-message"),{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({message:c})}),d("")}catch(e){console.error("Failed to send message:",e)}};return p?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r(),{id:"3699881f3338cd7",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:b.container,className:"jsx-3699881f3338cd7",children:[(0,o.jsxs)("div",{style:b.header,className:"jsx-3699881f3338cd7",children:[(0,o.jsx)("button",{onClick:s,style:b.closeBtn,className:"jsx-3699881f3338cd7",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-3699881f3338cd7",children:"Group Chat"})]}),(0,o.jsx)("div",{style:b.loadingContainer,className:"jsx-3699881f3338cd7",children:(0,o.jsx)("p",{style:b.loadingText,className:"jsx-3699881f3338cd7",children:"Loading chat..."})}),(0,o.jsxs)("div",{style:b.skeletonMessagesArea,className:"jsx-3699881f3338cd7",children:[(0,o.jsx)(y,{}),(0,o.jsx)(y,{}),(0,o.jsx)(y,{})]}),(0,o.jsxs)("div",{style:b.inputRow,className:"jsx-3699881f3338cd7",children:[(0,o.jsx)("input",{style:b.inputDisabled,placeholder:"Loading...",disabled:!0,className:"jsx-3699881f3338cd7"}),(0,o.jsx)("button",{style:b.sendBtnDisabled,disabled:!0,className:"jsx-3699881f3338cd7",children:"Send"})]})]})]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r(),{id:"cc39ef3cb74f9f88",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:b.container,className:"jsx-cc39ef3cb74f9f88",children:[(0,o.jsxs)("div",{style:b.header,className:"jsx-cc39ef3cb74f9f88",children:[(0,o.jsx)("button",{onClick:s,style:b.closeBtn,className:"jsx-cc39ef3cb74f9f88",children:"X"}),(0,o.jsx)("p",{style:{margin:0},className:"jsx-cc39ef3cb74f9f88",children:"Group Chat"})]}),(0,o.jsx)("div",{ref:m,onWheel:e=>{if(m.current){let{scrollTop:t,scrollHeight:a,clientHeight:o}=m.current;e.deltaY<0&&t>0?e.stopPropagation():e.deltaY>0&&t+o<a&&e.stopPropagation()}},style:b.messagesArea,className:"jsx-cc39ef3cb74f9f88",children:l.map((e,t)=>{let s=e.user===a;return(0,o.jsxs)("div",{style:s?b.myMessageRow:b.otherMessageRow,className:"jsx-cc39ef3cb74f9f88",children:[!s&&(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",width:30,height:30,alt:"avatar",style:b.avatar,className:"jsx-cc39ef3cb74f9f88"}),(0,o.jsxs)("div",{style:b.messageContent,className:"jsx-cc39ef3cb74f9f88",children:[(0,o.jsx)("div",{style:b.username,className:"jsx-cc39ef3cb74f9f88",children:e.user}),(0,o.jsx)("div",{style:s?b.myBubble:b.otherBubble,className:"jsx-cc39ef3cb74f9f88",children:e.message})]}),s&&(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",width:30,height:30,alt:"avatar",style:b.avatar,className:"jsx-cc39ef3cb74f9f88"})]},t)})}),(0,o.jsxs)("div",{style:b.inputRow,className:"jsx-cc39ef3cb74f9f88",children:[(0,o.jsx)("input",{style:b.input,value:c,onChange:e=>d(e.target.value),placeholder:"Type a message...",className:"jsx-cc39ef3cb74f9f88"}),(0,o.jsx)("button",{style:b.sendBtn,onClick:u,className:"jsx-cc39ef3cb74f9f88",children:"Send"})]})]})]})}function y(){return(0,o.jsxs)("div",{style:b.skeletonMessageRow,children:[(0,o.jsx)("div",{style:b.skeletonAvatar}),(0,o.jsx)("div",{style:b.skeletonBubble})]})}let b={container:{height:"300px",display:"flex",flexDirection:"column",fontSize:"14px",backgroundColor:"#1e1e2f",borderRadius:8,overflow:"hidden",border:"1px solid #2a2a3b"},header:{display:"flex",justifyContent:"space-between",backgroundColor:"#2a2a3b",padding:"6px 10px",borderBottom:"1px solid #3a3a4f"},closeBtn:{cursor:"pointer",color:"#fff",border:"none",background:"none",fontSize:"1rem"},messagesArea:{flex:1,overflowY:"auto",padding:"8px"},myMessageRow:{display:"flex",alignItems:"flex-start",justifyContent:"flex-end",marginBottom:"6px"},otherMessageRow:{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",marginBottom:"6px"},messageContent:{display:"flex",flexDirection:"column",maxWidth:"70%"},username:{fontSize:"0.8rem",fontWeight:600,color:"#ffdd57",marginBottom:"4px",letterSpacing:"0.5px",textShadow:"1px 1px 2px rgba(0,0,0,0.5)"},myBubble:{backgroundColor:"#007bff",color:"#fff",padding:"6px 10px",borderRadius:12,lineHeight:1.4,textAlign:"right"},otherBubble:{backgroundColor:"#2e3a4b",color:"#fff",padding:"6px 10px",borderRadius:12,lineHeight:1.4,textAlign:"left"},avatar:{borderRadius:"50%",objectFit:"cover",margin:"0 8px"},inputRow:{display:"flex",gap:6,padding:8,backgroundColor:"#2a2a3b",borderTop:"1px solid #3a3a4f"},input:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#2e3a4b",color:"#fff",padding:"6px",outline:"none"},sendBtn:{backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:4,padding:"6px 12px",cursor:"pointer",fontWeight:500},loadingContainer:{display:"flex",justifyContent:"center",alignItems:"center",padding:"16px"},loadingText:{color:"#ccc",fontStyle:"italic"},skeletonMessagesArea:{flex:1,overflowY:"auto",padding:"8px"},skeletonMessageRow:{display:"flex",alignItems:"center",marginBottom:"12px"},skeletonAvatar:{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:"#3a3a4f",animation:"blink 1.2s ease-in-out infinite"},skeletonBubble:{marginLeft:"8px",backgroundColor:"#3a3a4f",height:"16px",width:"40%",borderRadius:"12px",animation:"blink 1.2s ease-in-out infinite"},inputDisabled:{flex:1,borderRadius:4,border:"1px solid #444",backgroundColor:"#3a3a4f",color:"#888",padding:"6px",outline:"none"},sendBtnDisabled:{backgroundColor:"#555",color:"#ccc",border:"none",borderRadius:4,padding:"6px 12px",cursor:"not-allowed",fontWeight:500}};function j(e){let{group:t}=e,[a,s]=(0,i.useState)("activity"),[r,l]=(0,i.useState)(!1),[n,c]=(0,i.useState)(""),[p,m]=(0,i.useState)(!0),[g,y]=(0,i.useState)([]),[b,j]=(0,i.useState)([]),[k,C]=(0,i.useState)(""),[w,N]=(0,i.useState)(!1);(0,i.useEffect)(()=>{(async()=>{try{let e=(await (0,f.eO)()).data.user;C(e.email);let a=await (0,f.rl)(t.id);console.log(a),l(a.data.completed)}catch(e){console.error("Error fetching user or habit status:",e),c("Failed to fetch user or habit state.")}})()},[t.id]),(0,i.useEffect)(()=>{(async()=>{m(!0);try{let e=await (0,f.QY)(t.id);j(e.data.activity)}catch(e){console.error("Error fetching activity:",e),c("Failed to fetch activity feed.")}finally{m(!1)}})()},[t.id]),(0,i.useEffect)(()=>{(async()=>{try{let e=await (0,f.kK)(t.id);y(e.data.leaderboard)}catch(e){console.error("Error fetching leaderboard:",e),c("Failed to fetch leaderboard.")}})()},[t.id]);let B=async()=>{m(!0);try{let e=await (0,f.Kr)(t.id);alert(e.message||"Habit completed successfully!"),l(!0),j(e=>{var a;return[...e,{user_picture:null===(a=t.members.find(e=>e.email===k))||void 0===a?void 0:a.user_image,completed_date:new Date().toISOString().split("T")[0],days_ago:0}]}),y(e=>e.map(e=>e.user_email===k?{...e,completion_count:e.completion_count+1}:e))}catch(t){var e,a;console.error("Error completing habit:",t),c((null===(a=t.response)||void 0===a?void 0:null===(e=a.data)||void 0===e?void 0:e.error)||"Failed to complete the daily task.")}finally{m(!1)}};return(0,o.jsxs)("div",{style:v.card,children:[(0,o.jsx)("div",{style:v.topHeader,children:(0,o.jsx)("h3",{style:v.groupName,children:t.name})}),(0,o.jsxs)("div",{style:v.header,children:[(0,o.jsxs)("div",{style:v.tabs,children:[(0,o.jsx)("button",{style:{...v.tabButton,..."activity"===a?v.activeTab:{}},onClick:()=>s("activity"),children:"Activity"}),(0,o.jsx)("button",{style:{...v.tabButton,..."leaderboard"===a?v.activeTab:{}},onClick:()=>s("leaderboard"),children:"Leaderboard"}),(0,o.jsx)("button",{style:{...v.tabButton,..."about"===a?v.activeTab:{}},onClick:()=>s("about"),children:"About"})]}),(0,o.jsx)(u.uN,{style:v.chatIcon,title:"Open Chat",onClick:()=>N(!0)})]}),(0,o.jsx)("div",{style:v.content,children:p?(0,o.jsx)("div",{style:v.loading,children:"Loading..."}):(0,o.jsxs)(o.Fragment,{children:["activity"===a&&(0,o.jsx)(x,{activity:b}),"leaderboard"===a&&(0,o.jsx)(d,{leaderboard:g}),"about"===a&&(0,o.jsxs)("div",{style:v.about,children:[(0,o.jsx)("p",{style:v.description,children:t.description}),(0,o.jsxs)("p",{style:v.totalMembers,children:[t.members.length," members"]}),(0,o.jsx)("div",{style:v.membersList,children:t.members.map(e=>(0,o.jsxs)("div",{style:v.member,children:[(0,o.jsx)("img",{src:e.user_image||"https://via.placeholder.com/30",alt:"".concat(e.name,"'s avatar"),width:30,height:30,className:"member-avatar"}),(0,o.jsx)("span",{style:v.memberName,children:e.name})]},e.email))})]})]})}),n&&(0,o.jsx)("div",{style:v.error,children:n}),(0,o.jsx)("button",{onClick:B,style:{...v.completeButton,...r?v.completedButton:{}},disabled:r||p,children:r?"Completed Today \uD83C\uDF89":p?"Completing...":"Complete Habit \uD83D\uDE80"}),w&&(0,o.jsx)(h,{groupId:t.id,onClose:()=>N(!1)})]})}let v={topHeader:{marginBottom:"20px"},card:{backgroundColor:"#1c1c1c",borderRadius:"10px",padding:"20px",boxShadow:"0 4px 8px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:"500px"},header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},groupName:{margin:0,color:"#fff"},tabs:{display:"flex",gap:"10px"},tabButton:{padding:"5px 10px",backgroundColor:"#2c2c2c",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"0.9rem",transition:"background-color 0.3s"},activeTab:{backgroundColor:"#007bff"},content:{flex:1,marginBottom:"10px",overflowY:"auto",maxHeight:"350px"},about:{padding:"10px",backgroundColor:"#2c2c3b",borderRadius:"5px"},description:{marginBottom:"10px",color:"#ccc"},totalMembers:{marginBottom:"10px",color:"#ccc",fontWeight:"bold"},membersList:{display:"flex",flexWrap:"wrap",gap:"10px"},member:{display:"flex",alignItems:"center",backgroundColor:"#3c3c3c",padding:"5px 10px",borderRadius:"5px"},memberName:{color:"#fff",fontSize:"0.9rem"},chatIcon:{color:"#007bff",fontSize:"20px",cursor:"pointer",transition:"color 0.3s"},completeButton:{padding:"10px",backgroundColor:"#28a745",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"bold",marginTop:"10px",transition:"background-color 0.3s"},completedButton:{backgroundColor:"#6c757d",cursor:"not-allowed"},error:{color:"red",marginBottom:"10px"},loading:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",color:"#fff",fontSize:"1.2rem"}};var k=a(8173),C=a.n(k);function w(){let e=(0,n.useRouter)(),{data:t,error:a,isLoading:s}=(0,c.I)({queryKey:["profile"],queryFn:async()=>(await l.A.get("/api/profile",{withCredentials:!0})).data.user,staleTime:3e5,gcTime:18e5}),{data:d,error:p,isLoading:x}=(0,c.I)({queryKey:["joinedGroups",null==t?void 0:t.email],queryFn:async()=>((await l.A.get("/api/groups/discover",{withCredentials:!0})).data.groups||[]).filter(e=>e.members.some(e=>e.email===(null==t?void 0:t.email))),enabled:!!t,staleTime:3e5,gcTime:18e5}),m=(0,i.useCallback)(async()=>{try{await l.A.post("/api/logout",{},{withCredentials:!0}),e.push("/")}catch(e){console.error("Logout failed:",e),alert("Logout failed, see console for details.")}},[e]);return a||p?(0,o.jsxs)("div",{style:B.errorMsg,children:["Error: ",(null==a?void 0:a.message)||(null==p?void 0:p.message)]}):s?(0,o.jsx)("div",{style:B.loadingWrapper,children:(0,o.jsx)("p",{style:B.loadingText,children:"Loading profile..."})}):t?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r(),{id:"11a770e3a6c80e13",children:"@-webkit-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-moz-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@-o-keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}@keyframes blink{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}"}),(0,o.jsxs)("div",{style:B.pageWrapper,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("header",{style:B.header,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h1",{style:B.logoText,className:"jsx-11a770e3a6c80e13",children:"Buddy Board"}),(0,o.jsx)("div",{style:B.userArea,className:"jsx-11a770e3a6c80e13",children:(0,o.jsx)("img",{src:t.picture||"https://via.placeholder.com/40",alt:"".concat(t.name," avatar"),width:40,height:40,style:B.headerAvatar,className:"jsx-11a770e3a6c80e13"})})]}),(0,o.jsxs)("div",{style:B.container,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("section",{style:B.profileCard,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("h2",{style:B.welcomeText,className:"jsx-11a770e3a6c80e13",children:["Welcome, ",t.name,"!"]}),(0,o.jsx)("img",{src:t.picture||"https://via.placeholder.com/140",alt:"".concat(t.name,"'s avatar"),width:140,height:140,style:B.avatar,className:"jsx-11a770e3a6c80e13"}),(0,o.jsxs)("p",{style:B.emailText,className:"jsx-11a770e3a6c80e13",children:["Email: ",t.email]}),(0,o.jsx)("button",{onClick:m,style:B.logoutButton,className:"jsx-11a770e3a6c80e13",children:"Log Out"})]}),(0,o.jsxs)("section",{style:B.cardRow,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsxs)("div",{style:B.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:B.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Create Group"}),(0,o.jsx)("p",{style:B.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Start a new accountability group to track your habits together!"}),(0,o.jsx)(C(),{href:"/new",style:B.actionButton,children:"Create Group"})]}),(0,o.jsxs)("div",{style:B.card,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h3",{style:B.cardTitle,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"}),(0,o.jsx)("p",{style:B.cardDesc,className:"jsx-11a770e3a6c80e13",children:"Join existing groups and find new buddies to crush your goals."}),(0,o.jsx)("a",{href:"/discover",style:B.actionButton,className:"jsx-11a770e3a6c80e13",children:"Discover Groups"})]})]}),(0,o.jsxs)("section",{style:B.groupsSection,className:"jsx-11a770e3a6c80e13",children:[(0,o.jsx)("h2",{style:B.subheading,className:"jsx-11a770e3a6c80e13",children:"Your Joined Groups"}),x?(0,o.jsx)(N,{}):(null==d?void 0:d.length)===0?(0,o.jsx)("p",{style:B.noGroupsText,className:"jsx-11a770e3a6c80e13",children:"You have not joined any groups."}):(0,o.jsx)("div",{style:B.groupsGrid,className:"jsx-11a770e3a6c80e13",children:null==d?void 0:d.map(e=>(0,o.jsx)(j,{group:e},e.id))})]})]})]})]}):(0,o.jsx)("div",{style:B.errorMsg,children:"User not found."})}function N(){return(0,o.jsx)("div",{style:B.groupsGrid,children:[void 0,void 0].map((e,t)=>(0,o.jsx)("div",{style:B.skeletonGroupCard},t))})}let B={pageWrapper:{minHeight:"100vh",backgroundColor:"#121212",color:"#EAEAEA",display:"flex",flexDirection:"column",fontFamily:"'Roboto', sans-serif"},header:{backgroundColor:"#1B1B2F",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px"},logoText:{fontSize:"1.8rem",fontWeight:"bold",margin:0},userArea:{display:"flex",alignItems:"center"},headerAvatar:{borderRadius:"50%",objectFit:"cover"},container:{maxWidth:"1100px",margin:"0 auto",padding:"20px",display:"flex",flexDirection:"column",gap:"30px"},profileCard:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"30px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)"},welcomeText:{fontSize:"1.5rem",marginBottom:"20px",fontWeight:"bold"},avatar:{borderRadius:"50%",objectFit:"cover",width:"140px",height:"140px",marginBottom:"20px"},emailText:{marginBottom:"20px",color:"#ccc"},logoutButton:{padding:"10px 20px",backgroundColor:"#FF4B5C",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"bold",transition:"background-color 0.3s ease"},cardRow:{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"},card:{backgroundColor:"#1F1F3A",borderRadius:"12px",padding:"20px",textAlign:"center",boxShadow:"0 6px 12px rgba(0,0,0,0.3)",flex:"1 1 250px",maxWidth:"300px"},cardTitle:{fontSize:"1.2rem",fontWeight:"bold",color:"#fff",marginBottom:"10px"},cardDesc:{color:"#ccc",marginBottom:"15px",fontSize:"14px"},actionButton:{display:"inline-block",padding:"10px 18px",backgroundColor:"#007BFF",color:"#fff",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",transition:"background-color 0.3s ease"},groupsSection:{marginTop:"20px"},subheading:{fontSize:"1.4rem",marginBottom:"16px",fontWeight:"bold"},noGroupsText:{color:"#ccc",textAlign:"center",fontSize:"14px"},groupsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"20px"},skeletonGroupCard:{backgroundColor:"#2A2A4A",borderRadius:"10px",height:"120px",animation:"blink 1.2s ease-in-out infinite"},loadingWrapper:{minHeight:"100vh",backgroundColor:"#121212",display:"flex",justifyContent:"center",alignItems:"center"},loadingText:{color:"#ccc",fontSize:"1rem",fontFamily:"sans-serif",fontStyle:"italic"},errorMsg:{color:"red",textAlign:"center",marginTop:"20px",fontSize:"1.2rem"}}},5370:(e,t,a)=>{"use strict";a.d(t,{Kr:()=>l,QY:()=>c,U7:()=>i,eO:()=>s,kK:()=>n,pl:()=>r,rl:()=>d});let o=a(2651).A.create({baseURL:"https://pal-crush-2c20ca197e75.herokuapp.com/api",withCredentials:!0}),s=()=>o.get("/profile"),r=()=>o.get("/groups/discover"),i=e=>o.post("/groups/".concat(e,"/join")),l=e=>o.post("/groups/".concat(e,"/complete")),n=e=>o.get("/groups/".concat(e,"/leaderboard")),c=e=>o.get("/groups/".concat(e,"/activity")),d=e=>o.get("/groups/".concat(e,"/check-habit"))}},e=>{var t=t=>e(e.s=t);e.O(0,[711,651,69,527,412,441,517,358],()=>t(2804)),_N_E=e.O()}]);