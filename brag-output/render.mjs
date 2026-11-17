// Run from any directory: node C:\Users\rakho\k72\brag-output\render.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const output=path.dirname(fileURLToPath(import.meta.url));
const composition=path.join(output,'composition');
const env={...process.env};
const cache=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),'AppData','Local'),'npm-cache','_npx');
let cli;
if(fs.existsSync(cache)) for(const dir of fs.readdirSync(cache)){
 const root=path.join(cache,dir,'node_modules','hyperframes');
 try{if(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version==='0.9.30')cli=path.join(root,'bin','hyperframes.mjs');}catch{}
}
if(!cli){console.error('Hyperframes 0.9.30 was not found in the local cache. Run npx.cmd hyperframes@0.9.30 --version, then run this script again.');process.exit(1);}
const packages=path.join(process.env.LOCALAPPDATA||'', 'Microsoft','WinGet','Packages');
if(!env.HYPERFRAMES_FFMPEG_PATH && fs.existsSync(packages)){
 for(const name of fs.readdirSync(packages).filter(x=>x.startsWith('Gyan.FFmpeg'))){
  const root=path.join(packages,name);
  for(const folder of fs.readdirSync(root)){
   const bin=path.join(root,folder,'bin');
   if(fs.existsSync(path.join(bin,'ffmpeg.exe'))){env.HYPERFRAMES_FFMPEG_PATH=path.join(bin,'ffmpeg.exe');env.HYPERFRAMES_FFPROBE_PATH=path.join(bin,'ffprobe.exe');}
  }
 }
}
const ffmpeg=env.HYPERFRAMES_FFMPEG_PATH||'ffmpeg';
const ffprobe=env.HYPERFRAMES_FFPROBE_PATH||'ffprobe';
function run(exe,args,{capture=false}={}){
 const result=spawnSync(exe,args,{cwd:composition,env,windowsHide:true,encoding:'utf8',stdio:capture?'pipe':'inherit',maxBuffer:32*1024*1024});
 if(result.error)throw result.error;
 if(result.status!==0){if(capture){process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');}throw Error(`Command failed (exit ${result.status}). The final video has not been confirmed.`);}
 return result.stdout;
}
try{
 console.log('1/5 Checking the complete 18-second composition...');
 const report=run(process.execPath,[cli,'check','--json','--snapshots'],{capture:true});
 fs.writeFileSync(path.join(output,'check-report.json'),report);
 const check=JSON.parse(report);
 if(!check.ok||check.browserSkipped||!check.contrast?.checked){console.log(report);throw Error('Browser, layout or contrast checks did not pass. Send check-report.json back to ChatGPT.');}
 console.log(`Passed: ${check.contrast.checked} text contrast checks. Snapshot evidence saved in composition/.hyperframes/artifacts/.`);
 console.log('2/5 Rendering 1080p / 30 fps with one worker...');
 run(process.execPath,[cli,'render','--quality','delivery','--workers','1','--output','../brag-render.mp4']);
 console.log('3/5 Extracting the settled homepage poster...');
 run(ffmpeg,['-y','-v','error','-ss','4.2','-i','../brag-render.mp4','-frames:v','1','-q:v','2','../brag.jpg']);
 console.log('4/5 Adding the poster as frame zero...');
 run(ffmpeg,['-y','-v','error','-i','../brag-render.mp4','-i','../brag.jpg','-filter_complex',"[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]",'-map','[v]','-map','0:a?','-c:v','libx264','-crf','18','-preset','medium','-threads','2','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','../brag.mp4']);
 console.log('5/5 Verifying video, audio, duration and decodable frames...');
 const probe=JSON.parse(run(ffprobe,['-v','error','-show_entries','format=duration,size:stream=codec_type,width,height,r_frame_rate','-of','json','../brag.mp4'],{capture:true}));
 fs.writeFileSync(path.join(output,'render-report.json'),JSON.stringify(probe,null,2));
 const video=probe.streams.find(x=>x.codec_type==='video');
 if(!video||video.width!==1920||video.height!==1080||Math.abs(Number(probe.format.duration)-18)>.15||!probe.streams.some(x=>x.codec_type==='audio'))throw Error('Output dimensions, duration or audio verification failed.');
 run(ffmpeg,['-v','error','-i','../brag.mp4','-f','null','-']);
 console.log(`\nREADY: ${path.join(output,'brag.mp4')}\n18 seconds, 1920×1080, with music.\nPoster: ${path.join(output,'brag.jpg')}\nPlay the video and check each scene before posting. Music credit is in share-copy.txt.`);
}catch(error){console.error(`\nStopped: ${error.message}`);process.exitCode=1;}
