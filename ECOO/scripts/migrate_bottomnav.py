from pathlib import Path
files=[
 r'frontend\admin\src\pages\ScanAction.jsx',
 r'frontend\citizen\src\pages\PuntoFlow.jsx',
 r'frontend\citizen\src\pages\ScanAction.jsx',
 r'frontend\citizen\src\pages\ScanQR.jsx',
 r'frontend\company\src\pages\ScanAction.jsx',
 r'frontend\landing\src\pages\ScanAction.jsx',
]
for f in files:
    p=Path(f)
    if not p.exists():
        print('missing', f)
        continue
    text=p.read_text(encoding='utf8').replace('\r\n','\n')
    text=text.replace("import BottomNav from '../components/BottomNav';\n","import { AppShell, BottomNav } from '@ecoo/ui';\n")
    text=text.replace('import BottomNav from "../components/BottomNav";\n',"import { AppShell, BottomNav } from '@ecoo/ui';\n")
    text=text.replace('return (\n    <div className="app-shell">','return (\n    <AppShell footer={<BottomNav />}>')
    text=text.replace('return (\n    <motion.div className="app-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>','return (\n    <AppShell footer={<BottomNav />}>')
    text=text.replace('\n      <BottomNav />\n    </div>', '\n    </AppShell>')
    text=text.replace('\n      <BottomNav />\n    </motion.div>', '\n    </AppShell>')
    text=text.replace('\n      <BottomNav />\n  );','\n    </AppShell>\n  );')
    p.write_text(text.replace('\n','\r\n'), encoding='utf8')
    print('updated', f)
