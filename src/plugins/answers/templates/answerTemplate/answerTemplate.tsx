import BaseChatTemplate from '../../../../templatemanager/templates/baseChatTemplate';
import './answerTemplate.scss';
import { h, Fragment } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';


export function Answers(props: any) {
    const hostInstance = props.hostInstance;
    const msgData = props.msgData;
    const messageObj = {
        msgData: msgData,
        hostInstance: hostInstance
    }
    const [answersObj, setAnswersObj]: any = useState({ "generative": { "answerFragments": [], "sources": [] }});
    const [modelType, setModelType] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imageObj, setImageObj] = useState({url:'',isShow:false});
    const imgSrcRef = useRef('');

    useEffect(() => {
        const results = messageObj?.msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.snippet_content;
        const templateType = messageObj?.msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0].snippet_type;
        setModelType(templateType);
        setAnswersObj((prevState: any) => ({ ...prevState}));
        updateGenerativePayload(results);
    }, [msgData])

    //generative template payload update
    const updateGenerativePayload = (data: any) => {
        let answer_fragment: Array<Object> = [];
        let sources_data: Array<Object> = [];
        data?.forEach((item: any) => {
            const isExist = sources_data.find((source: any) => source.id === item?.sources[0]?.doc_id);
            if (!isExist) sources_data.push({ "title": item?.sources[0]?.title, "id": item?.sources[0]?.doc_id, "url": item?.sources[0]?.url, "file_url": item?.sources[0]?.file_url });
        });
        data?.forEach((answer: any) => {
            const index = sources_data.findIndex((source: any) => source.id === answer?.sources[0]?.doc_id);
            answer_fragment.push({ "title": answer?.answer_fragment, "id": index });
        });
        setAnswersObj((prevState: any) => ({ ...prevState, "generative": { "answerFragment": answer_fragment, "sources": sources_data } }));
    }

    //redirect to specific url
    const redirectToURL=(url:string)=>{
        window.open(url, '_blank'); 
    }

    const showFileUrl = (event:any ,url:string, show:boolean) => {
        setImageObj({"url": url, isShow:false});
        setTimeout(()=>{
           if(show) setImageObj(preState=>({...preState,isShow:show}));
        },200)
    }


    return (
        <div class="sa-answer-block">
            {
                (modelType === 'generative_model'  || modelType === 'extractive_model') ? (
                    <Fragment>
                        <div class="sa-answer-result-block">
                            <div class="sa-answer-result-sub-block">
                                {
                                    answersObj.generative?.answerFragment?.map((answer: any) =>
                                        <span class="sa-answer-result-heading" onMouseOver={()=>setSelectedIndex(answer?.id + 1)} onMouseOut={()=>setSelectedIndex(0)}>{answer?.title} <span><sup>{answer?.id + 1}</sup></span></span>
                                    )
                                }                                
                            </div>
                            <div className="sa-file-popup-img-container">
                            {<div className={`sa-file-popup-img ${!imageObj?.isShow&&'d-none'} `}>
                                <img id="sa-file-img" src={imageObj.url}/>
                                </div>}
                            </div>
                            <div className="sa-answer-gen-footer">
                                    {
                                        answersObj?.generative?.sources?.map((source: any, index: number) => (
                                            <div class="sa-answer-result-footer" ><span onClick={()=>redirectToURL(source?.url)}>{index + 1}. <span className={`${(selectedIndex===index+1)&&'selected'}`}>{source?.title || source?.url}</span></span>
                                             {source?.file_url&&
                                            <Fragment>
                                                <span className="sa-answer-file-url-block" ><span className="sa-answer-file-url-icon" onMouseOver={($event)=>showFileUrl($event,source?.file_url,true)} onMouseOut={($event)=>showFileUrl($event,source?.file_url,false)}>i</span>
                                                </span>
                                            </Fragment>
                                             }
                                            </div>
                                        ))
                                    }
                            </div>
                            <div className="sa-answer-feedback-block">
                                <div className="sa-answer-left">
                                {modelType === 'generative_model'&& <Fragment>
                                    <div className="sa-answer-img">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M6.99607 1.06205C7.0236 0.841796 6.90264 0.629762 6.69903 0.541377C6.49542 0.452993 6.25792 0.509419 6.11582 0.679936L1.65109 6.03761C1.57393 6.13017 1.49578 6.22391 1.43888 6.30629C1.38507 6.38421 1.28681 6.53739 1.28378 6.73872C1.2803 6.9692 1.38301 7.18849 1.56229 7.33337C1.7189 7.45992 1.89949 7.48251 1.99379 7.49105C2.0935 7.50008 2.21554 7.50005 2.33604 7.50003L5.43354 7.50003L5.00379 10.938C4.97626 11.1583 5.09723 11.3703 5.30083 11.4587C5.50444 11.5471 5.74194 11.4906 5.88404 11.3201L10.3488 5.96245C10.4259 5.86989 10.5041 5.77615 10.561 5.69376C10.6148 5.61585 10.713 5.46266 10.7161 5.26134C10.7196 5.03085 10.6169 4.81157 10.4376 4.66669C10.281 4.54013 10.1004 4.51755 10.0061 4.50901C9.90636 4.49998 9.78431 4.5 9.66381 4.50003L6.56632 4.50003L6.99607 1.06205Z" fill="#6938EF"/>
                                        </svg>
                                    </div>
                                    <div className="sa-answer-text">Answered by AI</div>
                                    </Fragment>}
                                </div>
                            </div>
                        </div>

                    </Fragment>
                ) : (
                    <Fragment>
                        <div class="sa-answer-result-block">
                            <div class="sa-answer-result-heading">{answersObj?.extractive?.snippet_title}</div>
                            <div class="sa-answer-result-desc">{answersObj?.extractive?.snippet_content}</div>

                            <div class="sa-answer-result-footer">1. {answersObj?.extractive?.source}</div>
                        </div>
                    </Fragment>
                )
            }


        </div>
    );
}
    const updateMsgData = (msgData:any)=>{
        const updatedMsgData = {...msgData};
        if(updatedMsgData?.message?.length && updatedMsgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.type == 'extractive_model'){
            updatedMsgData.message[0].component.payload.answer_payload = {
              "center_panel": {
                  "data": [
                      {
                          "isPresentedAnswer": true,
                          "message": "Presented Answer",
                          "score": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.score||'',
                          "snippet_content": [
                              {
                                  "answer_fragment": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.chunk_text,
                                  "sources": [
                                      {
                                          "chunk_id": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.chunk_id,
                                          "doc_id": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.doc_id||'',
                                          "image_url": "",
                                          "source_id": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.source_id||'',
                                          "source_type": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.source_name||'',
                                          "title": msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.source_name||'',
                                          "url":msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.source_url||'',
                                          "file_url":msgData?.message[0]?.component?.payload?.answer_payload?.center_panel?.data[0]?.file_url||''
                                      }
                                  ]
                              }
                          ],
                          "snippet_title": "",
                          "snippet_type": "extractive_model"
                      }
                  ],
                  "type": "citation_snippet"
              }
    
            }
          }
        return updatedMsgData
    }

export function answerTemplateCheck(props: any) {
   
    const hostInstance = props.hostInstance;
    const msgData = props.msgData; 
    if (msgData?.message?.[0]?.component?.payload?.template_type == 'answerTemplate') {
            props.msgData = updateMsgData(props.msgData)
        return (
            <Answers {...props} />
        )
    }   
}

class TemplateAnswers extends BaseChatTemplate {
    hostInstance: any = this;

    renderMessage(msgData: any) {
        return this.getHTMLFromPreact(answerTemplateCheck, msgData, this.hostInstance);
    }
}

export default TemplateAnswers;

