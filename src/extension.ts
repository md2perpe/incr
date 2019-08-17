'use strict';

import * as vscode from 'vscode';

function isInt(n:any) {
    return Number(n) === n && n % 1 === 0;
}
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.incr',async () => {
        vscode.window.showInformationMessage('incr');
        let pattern = await vscode.window.showInputBox({ placeHolder: 'e.x <text>:start:step' });
        if(pattern===undefined){
            return;
        }
        let [_text,_start,_step]=pattern.trim().split(":");
        let start ,step=1;
        if(_start===undefined){
            start=1;
            step=1;
            _text="";
        }else if(_step===undefined){
            start=parseInt(_text);
            _text="";
            step=parseFloat(_start);
        }else{
            try {
                start=parseInt(_start);
                step=parseFloat(_step);
            } catch (error) {
                start=1;
                step=1;
                _text="";
            }
        }
        console.log(start+step);
        let v=vscode.window.activeTextEditor;
        if (v === undefined) {
            vscode.window.showErrorMessage("There is no active editor,\n please open file you want to action");
            return;
        } 
        if(v.selections!.length===0){
            vscode.window.showErrorMessage("There is no selection");            
            return;
        }
        await v.edit(eb=>{
            v!.selections.map(s=>{
                let pos=new vscode.Position(s.start.line,s.start.character);
                if(isInt(step)){
                    eb.insert(pos,_text+String(
                        Number(start).toFixed(0)
                        ));
                    
                    start+=step;
                }else{
                    let tf=String(parseInt(step)+step).substr(2).length

                    eb.insert(pos,_text+String(
                        Number(start).toFixed(tf)
                        ));
                    
                    start+=step;
                }
                
            });
        });
       

        
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
