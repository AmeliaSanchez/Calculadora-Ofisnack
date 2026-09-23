(() => {
const sizes=[100,50,30,20,15], $=id=>document.getElementById(id);
const people=$("people"),days=$("days"),per=$("per"),minus=$("perMinus"),plus=$("perPlus");
const fmt=n=>new Intl.NumberFormat("es-AR",{maximumFractionDigits:2}).format(n);
function val(el,max=Number.MAX_SAFE_INTEGER,int=false){let n=Number(String(el.value).replace(",","."));if(!Number.isFinite(n))return 0;n=Math.max(0,Math.min(max,n));return int?Math.floor(n):n}
function best(raw){const need=Math.max(0,Math.ceil(raw));if(!need)return{counts:[0,0,0,0,0],total:0,count:0,extra:0};
for(let total=need;total<=need+19;total++){let best=null,max100=Math.floor(total/100),min100=Math.max(0,max100-2);
for(let a=max100;a>=min100;a--){let ra=total-a*100;for(let b=Math.floor(ra/50);b>=0;b--){let rb=ra-b*50;for(let c=Math.floor(rb/30);c>=0;c--){let rc=rb-c*30;for(let d=Math.floor(rc/20);d>=0;d--){let rd=rc-d*20;if(rd%15)continue;let e=rd/15,count=a+b+c+d+e;if(!best||count<best.count)best={counts:[a,b,c,d,e],total,count,extra:total-raw}}}}}if(best)return best}
let count=Math.ceil(need/100);return{counts:[count,0,0,0,0],total:count*100,count,extra:count*100-raw}}
function desc(r){return r.count?r.counts.map((n,i)=>n?`${n} × Box ${sizes[i]}`:"").filter(Boolean).join(" + "):"0 boxes"}
function set(prefix,need,r){$(prefix+"snacks").textContent=fmt(need);$(prefix+"boxes").textContent=desc(r);$(prefix+"total").textContent=`${fmt(r.count)} ${r.count===1?"box":"boxes"} · ${fmt(r.total)} snacks`;$(prefix+"extra").textContent=r.extra>0.0001?`+ ${fmt(r.extra)} snacks de margen`:"Cantidad exacta · sin excedente"}
function render(){let p=val(people,100000,true),d=val(days,5,true),s=val(per);let w=p*d*s,md=d*4,m=p*md*s;$("wdays").textContent=`${d} ${d===1?"día":"días"}`;$("mdays").textContent=`${md} ${md===1?"día":"días"}`;set("w",w,best(w));set("m",m,best(m))}
function adjust(delta){let n=Math.max(0,val(per)+delta);per.value=String(Math.round(n*2)/2).replace(".",",");render()}
minus.addEventListener("click",()=>adjust(-.5));plus.addEventListener("click",()=>adjust(.5));
let timer;[people,days,per].forEach(el=>{el.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(render,80)});el.addEventListener("change",render)});
render();
})();