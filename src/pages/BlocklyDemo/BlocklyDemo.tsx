// import React, { useEffect, useRef, useState } from 'react'
// import { Typography, Modal, Button } from 'antd'
// import * as Blockly from 'blockly'
// import { blocks } from '../../Blockly/blocks/defineBlock.ts'
// import { forBlock } from '../../Blockly/generators/customBlock.ts'
// import { javascriptGenerator } from 'blockly/javascript'
// import { toolbox } from '../../Blockly/toolbox.ts'
// import { save, load } from '../../Blockly/serialization'
// import '../../Blockly/index.css'
// import { useParams } from 'react-router-dom'
//
// const { Title } = Typography
//
// const BlocklyDemo: React.FC = () => {
//     const { projectId } = useParams<{ projectId: string }>();
//     const blocklyDiv = useRef<HTMLDivElement>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null)
//     const [isModalVisible, setIsModalVisible] = useState(false)
//
//     useEffect(() => {
//         if (blocklyDiv.current) {
//             Blockly.common.defineBlocks(blocks)
//             Object.assign(javascriptGenerator.forBlock, forBlock)
//
//             const newWorkspace = Blockly.inject(blocklyDiv.current, { toolbox })
//             setWorkspace(newWorkspace)
//
//             load(newWorkspace)
//
//             const runCode = () => {
//                 const code = javascriptGenerator.workspaceToCode(newWorkspace)
//                 const codeDiv = document.getElementById('generatedCode')?.firstChild
//                 if (codeDiv) codeDiv.textContent = code
//             }
//
//             newWorkspace.addChangeListener((e: Blockly.Events.Abstract) => {
//                 if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || newWorkspace.isDragging()) return
//                 runCode()
//             })
//             newWorkspace.addChangeListener((e: Blockly.Events.Abstract) => {
//                 if (e.isUiEvent) return
//                 save(newWorkspace)
//             })
//
//             runCode()
//         }
//     }, [])
//
//     const executeCode = () => {
//         if (workspace) {
//             const code = javascriptGenerator.workspaceToCode(workspace)
//             const outputDiv = document.getElementById('output')
//             if (outputDiv) outputDiv.innerHTML = ''
//             eval(code)
//         }
//     }
//
//     const downloadXML = () => {
//         if (workspace) {
//             const xml = Blockly.Xml.workspaceToDom(workspace)
//             const xmlText = Blockly.Xml.domToPrettyText(xml)
//             const blob = new Blob([xmlText], { type: 'text/xml' })
//             const url = URL.createObjectURL(blob)
//             const a = document.createElement('a')
//             a.href = url
//             a.download = 'workspace.xml'
//             a.click()
//             URL.revokeObjectURL(url)
//         }
//     }
//
//     const uploadXML = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (workspace && event.target.files?.length) {
//             const file = event.target.files[0]
//             const reader = new FileReader()
//             reader.onload = (e) => {
//                 const xmlText = e.target?.result as string
//                 const parser = new DOMParser()
//                 const xml = parser.parseFromString(xmlText, 'text/xml')
//                 Blockly.Xml.clearWorkspaceAndLoadFromXml(xml.documentElement, workspace)
//             }
//             reader.readAsText(file)
//         }
//     }
//
//     const handleUploadClick = () => {
//         fileInputRef.current?.click()
//     }
//
//     const saveCodeAsTxt = () => {
//         if (workspace) {
//             const code = javascriptGenerator.workspaceToCode(workspace)
//             const blob = new Blob([code], { type: 'text/plain' })
//             const url = URL.createObjectURL(blob)
//             const a = document.createElement('a')
//             a.href = url
//             a.download = 'code.txt'
//             a.click()
//             URL.revokeObjectURL(url)
//         }
//     }
//
//     const clearWorkspace = () => {
//     if (workspace) {
//         const xml = Blockly.utils.xml.textToDom('<xml></xml>')
//         Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace)
//         localStorage.removeItem('mainWorkspace')
//     }
// }
//
//     const showModal = () => {
//         setIsModalVisible(true)
//     }
//
//     const handleOk = () => {
//         clearWorkspace()
//         setIsModalVisible(false)
//     }
//
//     const handleCancel = () => {
//         setIsModalVisible(false)
//     }
//
//     return (
//         <div>
//             <div id="pageContainer">
//                 <div id="outputPane">
//                     <pre id="generatedCode"><code style={{ textAlign: 'left' }}></code></pre>
//                     <button id="runCodeButton" onClick={() => {
//                         const code = document.getElementById('generatedCode')?.textContent
//                         if (code) console.log(code)
//                     }}>Log Code (test)
//                     </button>
//                     <button style={{ marginTop: '16px' }} id="executeCodeButton" onClick={() => {
//                         executeCode()
//                     }}>Execute Code (test)
//                     </button>
//                     <button style={{ marginTop: '16px' }} id="downloadXMLButton" onClick={() => {
//                         downloadXML()
//                     }}>Save XML
//                     </button>
//                     <button style={{ marginTop: '16px' }} id="uploadXMLButton" onClick={
//                         handleUploadClick
//                     }>Load XML
//                     </button>
//                     <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={uploadXML} />
//                     <button style={{ marginTop: '16px' }} id="saveCodeButton" onClick={() => {
//                         saveCodeAsTxt()
//                     }}>Save Code as TXT
//                     </button>
//                     <button style={{ marginTop: '16px' }} id="new" onClick={showModal}>New</button>
//                     <pre id="generatedXML"><code style={{ textAlign: 'left' }}></code></pre>
//                     <div id="output"></div>
//                 </div>
//                 <div id="blocklyDiv" ref={blocklyDiv}></div>
//             </div>
//             <Modal
//                 title="Confirm"
//                 visible={isModalVisible}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 okText="Agree"
//                 cancelText="Cancel"
//             >
//                 <p>Are you sure you want to clear the workspace?</p>
//             </Modal>
//         </div>
//     )
// }
//
// export default BlocklyDemo
