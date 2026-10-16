const PRESET = [{"name":"Netflix","ids":[8,175,1796],"id":"8"},{"name":"Amazon Prime Video","ids":[9,119,2100],"id":"9"},{"name":"Amazon Video","ids":[10],"id":"10"},{"name":"Disney+","ids":[337,2739],"id":"337"},{"name":"Apple TV+","ids":[350],"id":"350"},{"name":"Apple TV Store","ids":[2],"id":"2"},{"name":"HBO Max","ids":[384,1825,1899],"id":"384"},{"name":"Hulu","ids":[15],"id":"15"},{"name":"Paramount+","ids":[531,582,633,1770,1853,2303,2616,37],"id":"531"},{"name":"Peacock","ids":[386,387],"id":"386"},{"name":"Google Play Movies","ids":[3],"id":"3"},{"name":"Fandango at Home","ids":[7,332],"id":"7"},{"name":"Microsoft Store","ids":[68],"id":"68"},{"name":"YouTube","ids":[188,192],"id":"188"},{"name":"YouTube TV","ids":[2528],"id":"2528"},{"name":"Crunchyroll","ids":[283,1968],"id":"283"},{"name":"Starz","ids":[43,634,1794,1855],"id":"43"},{"name":"AMC+","ids":[526,528,635,1854,352],"id":"526"},{"name":"Discovery+","ids":[520,584],"id":"520"},{"name":"MUBI","ids":[11,201],"id":"11"},{"name":"Shudder","ids":[99,204],"id":"99"},{"name":"BritBox","ids":[151,1852,197],"id":"151"},{"name":"Acorn TV","ids":[87,196],"id":"87"},{"name":"Curiosity Stream","ids":[190],"id":"190"},{"name":"MGM+","ids":[34,583,636],"id":"34"},{"name":"Sundance Now","ids":[143,205],"id":"143"},{"name":"ALLBLK","ids":[251,343],"id":"251"},{"name":"Tubi","ids":[73],"id":"73"},{"name":"Pluto TV","ids":[300],"id":"300"},{"name":"fuboTV","ids":[257],"id":"257"},{"name":"Philo","ids":[2383],"id":"2383"},{"name":"Kanopy","ids":[191],"id":"191"},{"name":"Hoopla","ids":[212],"id":"212"},{"name":"The Roku Channel","ids":[207],"id":"207"},{"name":"Criterion Channel","ids":[258],"id":"258"},{"name":"The CW","ids":[83],"id":"83"},{"name":"PBS","ids":[209,293,294],"id":"209"},{"name":"Plex","ids":[538,2077],"id":"538"},{"name":"ViX","ids":[457],"id":"457"}];
const BATCH=8;
const en=()=>String(kino.lang||'').startsWith('en');
const tr=(es,eng)=>en()?eng:es;
const lang=()=>en()?'en-US':'es-MX';
const region=()=>String(kino.config.get('region')||'MX').trim().toUpperCase();
const art=(path,size='w500')=>path?'https://image.tmdb.org/t/p/'+size+path:undefined;
const err=(code,es,eng)=>kino.error(code,'catalog',{userMessage:tr(es,eng)});
async function api(path,params={}) {
 await null;
 if(typeof kino.tmdb!=='function') throw err('unavailable','Actualiza la aplicación para usar este catálogo.','Update the app to use this catalog.');
 return kino.tmdb(path,params);
}
function config() {
 const country=region();
 if(!/^[A-Z]{2}$/.test(country)) throw err('unavailable','Escribe un país de dos letras en los ajustes.','Enter a two-letter country in settings.');
 return country;
}
async function mapLimit(items,fn,width=4) {
 await null;
 const out=[];
 for(let i=0;i<items.length;i+=width) out.push(...await Promise.all(items.slice(i,i+width).map(fn)));
 return out;
}
async function platforms(kind) {
 await null;
 const key=String(kino.config.get('tmdbKey')||'').trim(),country=config();
 if(!key) return PRESET;
 const cacheKey='providers-'+kind+'-'+country;
 const cached=kino.storage.get(cacheKey);
 if(cached) {try {const x=JSON.parse(cached);if(Array.isArray(x)&&x.length) return x;}catch(_) {}}
 const params=new URLSearchParams({language:lang(),watch_region:country});
 const headers={};
 if(key.startsWith('eyJ')) headers.Authorization='Bearer '+key; else params.set('api_key',key);
 const response=await kino.fetch('https://api.themoviedb.org/3/watch/providers/'+kind+'?'+params,{headers});
 if(!response.ok) throw err(response.status===429?'rate_limited':'auth_required','Revisa la configuración del catálogo.','Check the catalog settings.');
 const data=await response.json();
 const providers=(data.results||[]).filter(p=>Number.isInteger(p.provider_id)&&p.provider_id>0).map(p=>({id:String(p.provider_id),ids:[p.provider_id],name:p.provider_name}));
 if(!providers.length) return [];
 kino.storage.set(cacheKey,JSON.stringify(providers),{ttlMs:86400000});
 return providers;
}
async function keywords() {
 await null;
 const cached=kino.storage.get('lgbt-v1');
 if(cached) {try {const ids=JSON.parse(cached);if(Array.isArray(ids)&&ids.length&&ids.every(Number.isInteger)) return ids;}catch(_) {}}
 const pages=await mapLimit(['lgbt','gay','lesbian','transgender','bisexual'],query=>api('/search/keyword',{query,page:1}));
 const ids=[...new Set(pages.flatMap(p=>(p.results||[]).filter(k=>/^(lgbt[A-Za-z]*|gay|lesbian|transgender|bisexual)( |$)/i.test(k.name||'')).map(k=>k.id)).filter(n=>Number.isInteger(n)&&n>0))].slice(0,45);
 if(!ids.length) throw err('unavailable','No se encontraron las etiquetas LGBT.','The LGBT tags could not be found.');
 kino.storage.set('lgbt-v1',JSON.stringify(ids),{ttlMs:604800000});return ids;
}
function item(m,kind) {
 return {id:kind+'-'+m.id,ref:kind+':'+m.id,kind:kind==='tv'?'series':'movie',title:m.title||m.name||m.original_title||m.original_name,
 originalTitle:m.original_title||m.original_name,year:(m.release_date||m.first_air_date||'').slice(0,4),ids:{tmdb:m.id},
 poster:art(m.poster_path),backdrop:art(m.backdrop_path,'w1280'),overview:m.overview||undefined,rating:m.vote_average||undefined};
}
function route(kind,p=null,lgbt=false) {return {kind,ids:p?p.ids:[],name:p?p.name:'',lgbt};}
function parseRoute(ref) {
 const r=JSON.parse(ref);
 if(!['movie','tv'].includes(r.kind)||!Array.isArray(r.ids)||r.ids.length>12||!r.ids.every(n=>Number.isInteger(n)&&n>0)||typeof r.lgbt!=='boolean') throw kino.error('not_found','Ruta inválida.');
 return r;
}
async function discover(r,page=1) {
 await null;
 const params={language:lang(),watch_region:config(),include_adult:false,page,sort_by:'popularity.desc'};
 const mode=String(kino.config.get('mode')||'stream');
 if(r.ids.length) {params.with_watch_providers=r.ids.join('|');if(mode==='stream') params.with_watch_monetization_types='flatrate|free|ads';}
 if(r.lgbt) params.with_keywords=(await keywords()).join('|');
 const today=new Date().toISOString().slice(0,10);
 params[r.kind==='movie'?'primary_release_date.lte':'first_air_date.lte']=today;
 const data=await api('/discover/'+r.kind,params);
 return {items:(data.results||[]).filter(m=>!m.adult).map(m=>item(m,r.kind)),next:page<Math.min(data.total_pages||1,500)?String(page+1):undefined};
}
async function row(r) {
 const page=await discover(r);
 const type=r.kind==='movie'?tr('Películas','Movies'):tr('Series','Series');
 return {id:(r.lgbt?'lgbt':r.ids.join('-')||'all')+'-'+r.kind,title:(r.lgbt?'LGBT+':r.name||tr('Todas','All'))+' · '+type,
 genre:r.kind==='movie'?'peliculas':'series',ref:JSON.stringify(r),items:page.items};
}
export async function home() {
 const providers=await platforms('movie');
 const routes=providers.slice(0,6).flatMap(p=>[route('movie',p),route('tv',p)]);
 await keywords();
 routes.push(route('movie',null,true),route('tv',null,true));
 return mapLimit(routes,row);
}
export async function section({tab}={}) {
 await null;
 const match=/^(movie|tv|lgbt)-([0-9]+)$/.exec(tab||'movie-0');
 const kind=match?match[1]:'movie',page=match?Math.min(Number(match[2]),100):0;
 const chosen=kind+'-'+page;
 const tabs=[{id:kind==='movie'?chosen:'movie-0',label:tr('Películas','Movies')},{id:kind==='tv'?chosen:'tv-0',label:tr('Series','Series')},{id:kind==='lgbt'?chosen:'lgbt-0',label:'LGBT+'}];
 let rows=[];
 if(kind==='lgbt') {
  rows=await mapLimit([route('movie',null,true),route('tv',null,true)],row);
 } else {
  const providers=await platforms(kind),start=page*BATCH;
  if(page>0) tabs.push({id:kind+'-'+(page-1),label:tr('Plataformas anteriores','Previous platforms')});
  if(start+BATCH<providers.length) tabs.push({id:kind+'-'+(page+1),label:tr('Más plataformas','More platforms')});
  rows=await mapLimit(providers.slice(start,start+BATCH).map(p=>route(kind,p)),row);
 }
 return {tabs,tab:chosen,hero:{title:tr('Catálogo por plataformas','Catalog by platform'),text:tr('País: ','Country: ')+config()+'. '+tr('Abre una ficha y busca dónde verla con tus otros plugins.','Open a title and find playback with your other plugins.')},rows};
}
export async function browse(ref,cursor) {
 await null;
 const page=cursor==null||cursor===''?1:Number(cursor);
 if(!Number.isInteger(page)||page<1||page>500) throw kino.error('not_found','Página inválida.');
 let r;try {r=parseRoute(ref);}catch(_) {throw kino.error('not_found','Ruta inválida.');}
 return discover(r,page);
}
export async function search(query) {
 await null;
 if(!query||!String(query.q||'').trim()) return [];
 const endpoint=query.type==='movie'?'/search/movie':query.type==='series'?'/search/tv':'/search/multi';
 const data=await api(endpoint,{query:String(query.q).slice(0,200),language:lang(),include_adult:false,page:1});
 return (data.results||[]).filter(m=>!m.adult&&(endpoint!=='/search/multi'||['movie','tv'].includes(m.media_type))).map(m=>item(m,endpoint==='/search/tv'?'tv':endpoint==='/search/movie'?'movie':m.media_type));
}
export async function episodes(ref) {
 await null;
 const m=/^tv:([0-9]+)(?::([0-9]+))?$/.exec(ref||'');
 if(!m) throw kino.error('not_found','Serie inválida.');
 const id=Number(m[1]),show=await api('/tv/'+id,{language:lang()});
 const seasons=(show.seasons||[]).filter(s=>s.season_number>0&&s.season_number<=999);
 const number=m[2]?Number(m[2]):seasons.length?seasons[0].season_number:null;
 if(number!==null&&!seasons.some(s=>s.season_number===number)) throw kino.error('not_found','Temporada inválida.');
 const season=number===null?{episodes:[]}:await api('/tv/'+id+'/season/'+number,{language:lang()});
 return {series:{title:show.name,overview:show.overview,poster:art(show.poster_path),backdrop:art(show.backdrop_path,'w1280'),year:(show.first_air_date||'').slice(0,4),ids:{tmdb:id}},
 seasons:seasons.map(s=>({id:'season-'+s.season_number,ref:'tv:'+id+':'+s.season_number,title:s.name||tr('Temporada ','Season ')+s.season_number,number:s.season_number,current:s.season_number===number})),
 episodes:(season.episodes||[]).filter(e=>e.episode_number>0).map(e=>({season:number,number:e.episode_number,title:e.name,overview:e.overview,airDate:e.air_date,still:art(e.still_path),runtimeMinutes:e.runtime||undefined,ref:'episode:'+id+':'+number+':'+e.episode_number}))};
}
export async function resolve() {await null;throw kino.error('not_found','Catálogo sin reproducción.');}

