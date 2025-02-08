(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[359],{4405:(e,t,o)=>{Promise.resolve().then(o.bind(o,9313))},6046:(e,t,o)=>{"use strict";var r=o(6658);o.o(r,"useRouter")&&o.d(t,{useRouter:function(){return r.useRouter}})},9313:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>d});var r=o(5155),n=o(2115),a=o(6046);let i={container:{padding:"40px",maxWidth:"800px",margin:"auto",backgroundColor:"#1c1c1c",borderRadius:"15px",color:"#fff",boxSizing:"border-box",textAlign:"center"},heading:{fontSize:"36px",fontWeight:"bold",marginBottom:"30px"},input:{width:"100%",padding:"15px 20px",fontSize:"18px",marginBottom:"20px",borderRadius:"8px",border:"1px solid #ccc",boxSizing:"border-box"},textarea:{width:"100%",padding:"15px 20px",fontSize:"18px",marginBottom:"30px",borderRadius:"8px",border:"1px solid #ccc",boxSizing:"border-box",resize:"vertical"},button:{width:"100%",padding:"15px 0",backgroundColor:"#28a745",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"bold",fontSize:"20px",boxSizing:"border-box",transition:"background-color 0.3s ease"}};function l(e){let{onCreate:t}=e,[o,a]=(0,n.useState)(""),[l,s]=(0,n.useState)(""),[d,c]=(0,n.useState)(!1),u=async()=>{if(!d){if(!o.trim()||!l.trim()){alert("Please provide both name and description.");return}c(!0);try{let e={name:o.trim(),description:l.trim()};console.log("Group data to be sent to parent:",e),t(e),a(""),s("")}catch(e){console.error("Error in CreateGroup component:",e),alert("Failed to create group.")}finally{c(!1)}}};return(0,r.jsxs)("div",{style:i.container,children:[(0,r.jsx)("h2",{style:i.heading,children:"Create a Group"}),(0,r.jsx)("input",{style:i.input,type:"text",placeholder:"Work out \uD83C\uDFCB️‍♀️, Read \uD83D\uDCDA, Sleep early \uD83D\uDECC",value:o,onChange:e=>a(e.target.value),disabled:d}),(0,r.jsx)("textarea",{style:i.textarea,placeholder:"What would people gain by joining your group? What should they do?",value:l,onChange:e=>s(e.target.value),disabled:d}),(0,r.jsx)("button",{style:i.button,onClick:u,disabled:d,children:d?"Creating...":"Create Group"})]})}var s=o(2651);function d(){let[e,t]=(0,n.useState)(!1),o=(0,a.useRouter)(),i=async r=>{if(!e){t(!0),console.log("handleCreateGroup called with:",r);try{let e=await s.A.post("/api/groups/create",r,{withCredentials:!0});alert(e.data.message||"Group created successfully!"),o.push("/profile")}catch(e){var n,a;console.error("Error creating group:",e),s.A.isAxiosError(e)&&(null===(a=e.response)||void 0===a?void 0:null===(n=a.data)||void 0===n?void 0:n.error)?alert("Failed to create group: ".concat(e.response.data.error)):alert("Failed to create group.")}finally{t(!1)}}};return(0,r.jsxs)("div",{style:c.pageContainer,children:[(0,r.jsxs)("div",{style:c.header,children:[(0,r.jsx)("button",{style:c.backButton,onClick:()=>o.back(),"aria-label":"Go Back",children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"none",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:c.backIcon,children:(0,r.jsx)("polyline",{points:"15 18 9 12 15 6"})})}),(0,r.jsx)("h1",{style:c.pageHeading,children:"Create a New Group"})]}),(0,r.jsx)("p",{style:c.subHeading,children:"Start a new accountability group and crush your goals together with your friends!"}),(0,r.jsx)(l,{onCreate:i}),(0,r.jsx)("p",{style:c.footerNote,children:"Invite your friends to join and make your group more impactful!"})]})}let c={pageContainer:{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",backgroundColor:"#1e1e2f",color:"#fff",padding:"40px 20px",boxSizing:"border-box",fontFamily:"Arial, sans-serif"},header:{display:"flex",alignItems:"center",marginBottom:"40px"},backButton:{background:"none",border:"none",padding:"5px",cursor:"pointer",display:"flex",alignItems:"center",transition:"transform 0.2s",marginRight:"15px"},backIcon:{width:"24px",height:"24px",stroke:"#fff"},pageHeading:{fontSize:"28px",fontWeight:"bold",textAlign:"center",flex:1,margin:"0",color:"#fff"},subHeading:{fontSize:"18px",color:"#ccc",marginBottom:"30px",textAlign:"center"},footerNote:{fontSize:"14px",color:"#aaa",marginTop:"auto",textAlign:"center",fontStyle:"italic"}}}},e=>{var t=t=>e(e.s=t);e.O(0,[651,441,517,358],()=>t(4405)),_N_E=e.O()}]);