"""Launch existing notebook code / 启动现有笔记本代码，不复制识别算法。"""
from pathlib import Path
import ast
import json
import os
import sys
import traceback

HERE = Path(__file__).resolve().parent
os.chdir(HERE)

def main():
    notebook = json.loads((HERE / 'Live_to_VRM_AllInOne.ipynb').read_text(encoding='utf-8'))
    namespace = {'__name__': 'live_notebook'}
    flags = {'INSTALL_DEPENDENCIES', 'START_LIVE', 'OPEN_LIVE_PAGE', 'START_CAMERA', 'STOP_LIVE_SERVER'}
    # Disable automatic cell actions; launch once below / 禁用单元自动启动，最后统一启动。
    for index, cell in enumerate(notebook['cells']):
        if cell['cell_type'] != 'code':
            continue
        tree = ast.parse(''.join(cell['source']))
        for node in tree.body:
            if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id in flags for t in node.targets):
                node.value = ast.Constant(False)
        exec(compile(ast.fix_missing_locations(tree), f'notebook_cell_{index}', 'exec'), namespace)
    if '--classic' in sys.argv:
        namespace['BACKEND'] = 'classic'
    elif '--mediapipe' in sys.argv:
        namespace['BACKEND'] = 'mediapipe'
    url = namespace['start_live_server'](True)
    (HERE / 'live_url.txt').write_text(url, encoding='utf-8')
    print('Backend:', namespace['BACKEND'], '\nLive URL:', url, flush=True)
    try:
        namespace['run_live_camera']()
    finally:
        namespace['live_server'].shutdown()
        namespace['live_server'].server_close()

if __name__ == '__main__':
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.exit(1)
