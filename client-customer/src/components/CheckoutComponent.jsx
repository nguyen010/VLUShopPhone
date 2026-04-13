import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import { PROVINCES, getDistricts, getStores } from '../utils/VietnamData';

function QRCode({ value = '', size = 168 }) {
  const cells = 21; const cs = size / cells;
  const h = value.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);
  const mods = [];
  for (let r = 0; r < cells; r++) {
    for (let c2 = 0; c2 < cells; c2++) {
      const fin = (r<8&&c2<8)||(r<8&&c2>=cells-8)||(r>=cells-8&&c2<8);
      const filled = fin
        ? (r===0||r===6||c2===0||c2===6||(r>=2&&r<=4&&c2>=2&&c2<=4)||(r>=2&&r<=4&&c2>=cells-5&&c2<=cells-3)||(r>=cells-5&&r<=cells-3&&c2>=2&&c2<=4))
        : ((r*31+c2*17+h)%4<2);
      if (filled) mods.push([r,c2]);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff"/>
      {mods.map(([r,c2]) => <rect key={`${r}-${c2}`} x={c2*cs} y={r*cs} width={cs} height={cs} fill="#111"/>)}
    </svg>
  );
}

const PAYMENT_METHODS = [
  {id:'COD',  icon:'🚚',label:'Thanh toán khi nhận hàng',  sub:'Ship COD – An toàn, tiện lợi',          color:'#f59e0b'},
  {id:'QR',   icon:'📲',label:'Chuyển khoản QR ngân hàng', sub:'Quét mã QR – Xác nhận ngay',            color:'#3b82f6'},
  {id:'MOMO', icon:'💜',label:'Ví MoMo',                   sub:'Giảm thêm 2% tối đa 200.000đ',          color:'#ae3d8d'},
  {id:'VNPAY',icon:'💳',label:'VNPAY',                     sub:'Thanh toán qua ví VNPAY-QR',             color:'#1a56db'},
  {id:'VISA', icon:'💰',label:'Thẻ Visa / Master / JCB',   sub:'Thanh toán thẻ quốc tế qua OnePay',     color:'#1a1a1a'},
];

const card  = {background:'#fff',borderRadius:'10px',border:'1.5px solid #eee',padding:'16px',marginBottom:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'};
const sec   = {fontSize:'12px',fontWeight:800,color:'#888',textTransform:'uppercase',letterSpacing:'1px',margin:'16px 0 8px'};
const lbl   = {fontSize:'11px',fontWeight:800,color:'#888',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'};
const inp   = {width:'100%',padding:'10px 13px',border:'1.5px solid #e0e0e0',borderRadius:'8px',fontSize:'14px',fontFamily:'Be Vietnam Pro,sans-serif',outline:'none',color:'#1a1a1a',background:'#fff',transition:'border-color 0.2s'};
const sel   = {...inp,cursor:'pointer',appearance:'none'};
const ovrl  = {position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',backdropFilter:'blur(3px)'};
const btnR  = {width:'100%',padding:'14px',background:'#d70018',color:'#fff',border:'none',borderRadius:'10px',fontSize:'15px',fontWeight:800,cursor:'pointer',fontFamily:'Be Vietnam Pro,sans-serif',boxShadow:'0 4px 20px rgba(215,0,24,0.3)',marginTop:'4px',transition:'all 0.2s'};

function Row({label,value}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px dashed #f0f0f0'}}>
      <span style={{fontSize:'13px',color:'#888'}}>{label}</span>
      <span style={{fontSize:'13px',color:'#1a1a1a',fontWeight:500}}>{value}</span>
    </div>
  );
}

class Checkout extends Component {
  static contextType = MyContext;
  constructor(props){
    super(props);
    this.state={
      step:1,
      deliveryType:'store',
      province:'',district:'',selectedStore:'',
      recipientName:'',recipientPhone:'',address:'',note:'',wantInvoice:'no',
      paymentMethod:'',showPaymentModal:false,selectedPaymentTemp:'',
      showQR:false,loading:false,done:false,qrCountdown:0,qrPaid:false,
    };
  }
  componentDidMount(){
    const c=this.context.customer;
    if(c) this.setState({recipientName:c.name||'',recipientPhone:c.phone||''});
  }
  get districts(){return getDistricts(this.state.province);}
  get stores(){return getStores(this.state.province,this.state.district);}
  foc=e=>{e.target.style.borderColor='#d70018';};
  blu=e=>{e.target.style.borderColor='#e0e0e0';};

  render(){
    const {token,customer,mycart}=this.context;
    if(!token) return <Navigate to="/login" replace/>;
    if(mycart.length===0&&!this.state.done) return <Navigate to="/mycart" replace/>;
    if(this.state.done) return <Navigate to="/myorders" replace/>;
    const total=CartUtil.getTotal(mycart);
    return(
      <div style={{maxWidth:'680px',margin:'0 auto',padding:'20px 16px 48px',fontFamily:'Be Vietnam Pro,sans-serif'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <button onClick={()=>this.state.step===2?this.setState({step:1}):this.props.navigate('/mycart')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'20px',padding:'4px',color:'#555',lineHeight:1}}>←</button>
          <h1 style={{fontSize:'18px',fontWeight:800,flex:1,textAlign:'center',color:'#1a1a1a'}}>Thanh toán</h1>
          <div style={{width:'28px'}}/>
        </div>
        {/* Steps */}
        <div style={{display:'flex',marginBottom:'24px'}}>
          {['THÔNG TIN','THANH TOÁN'].map((s,i)=>{
            const active=this.state.step===i+1, done=this.state.step>i+1;
            return(<div key={s} style={{flex:1,textAlign:'center',padding:'10px 0',cursor:done?'pointer':'default',borderBottom:`3px solid ${active||done?'#d70018':'#e0e0e0'}`}} onClick={()=>done&&this.setState({step:i+1})}>
              <span style={{fontSize:'13px',fontWeight:800,color:active||done?'#d70018':'#bbb',letterSpacing:'0.5px'}}>{i+1}. {s}</span>
            </div>);
          })}
        </div>
        {this.state.step===1?this.renderStep1(mycart,total,customer):this.renderStep2(mycart,total,customer)}
        {this.state.showPaymentModal&&this.renderPaymentModal()}
        {this.state.showQR&&this.renderQRModal(total)}
      </div>
    );
  }

  renderStep1(mycart,total,customer){
    const {deliveryType,province,district,selectedStore,recipientName,recipientPhone,address,note,wantInvoice}=this.state;
    return(
      <div>
        {/* Products */}
        <div style={card}>
          {mycart.map(item=>(
            <div key={item.product._id} style={{display:'flex',gap:'12px',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f5f5f5'}}>
              <img src={'data:image/jpg;base64,'+item.product.image} style={{width:'54px',height:'54px',objectFit:'contain',borderRadius:'8px',background:'#f5f5f5',padding:'4px',flexShrink:0,border:'1px solid #eee'}} alt=""/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1a1a1a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'2px'}}>{item.product.name}</div>
                <div style={{fontSize:'14px',color:'#d70018',fontWeight:800}}>{(item.product.price||0).toLocaleString()}đ</div>
              </div>
              <div style={{fontSize:'13px',color:'#888',flexShrink:0}}>Số lượng: <b style={{color:'#1a1a1a'}}>{item.quantity}</b></div>
            </div>
          ))}
        </div>

        {/* Customer info */}
        <div style={sec}>THÔNG TIN KHÁCH HÀNG</div>
        <div style={card}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontWeight:700,fontSize:'14px'}}>{customer?.name}</span>
              <span style={{background:'#d70018',color:'#fff',fontSize:'10px',padding:'1px 7px',borderRadius:'4px',fontWeight:800}}>KH</span>
            </div>
            <span style={{color:'#888',fontSize:'13px'}}>{customer?.phone}</span>
          </div>
          <div style={{fontSize:'11px',fontWeight:700,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'3px'}}>EMAIL</div>
          <div style={{fontSize:'13.5px',color:'#333',marginBottom:'8px'}}>{customer?.email}</div>
          <div style={{fontSize:'12px',color:'#aaa',fontStyle:'italic',marginBottom:'8px'}}>(*) Hóa đơn VAT sẽ được gửi qua email này</div>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#555',cursor:'pointer'}}>
            <input type="checkbox" style={{accentColor:'#d70018'}}/> Nhận email thông báo và ưu đãi từ PhoneShop
          </label>
        </div>

        {/* Delivery */}
        <div style={sec}>THÔNG TIN NHẬN HÀNG</div>
        <div style={card}>
          {/* Toggle store/delivery */}
          <div style={{display:'flex',gap:'10px',marginBottom:'18px'}}>
            {[{id:'store',label:'🏪 Nhận tại cửa hàng'},{id:'delivery',label:'🚚 Giao hàng tận nơi'}].map(o=>(
              <label key={o.id} style={{flex:1,display:'flex',alignItems:'center',gap:'8px',padding:'10px 14px',border:`2px solid ${deliveryType===o.id?'#d70018':'#e0e0e0'}`,borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:deliveryType===o.id?'#d70018':'#555',background:deliveryType===o.id?'#fff5f5':'#fff',transition:'all 0.15s'}}>
                <input type="radio" name="delivery" checked={deliveryType===o.id} onChange={()=>this.setState({deliveryType:o.id,province:'',district:'',selectedStore:''})} style={{accentColor:'#d70018'}}/>{o.label}
              </label>
            ))}
          </div>

          {/* STORE PICKUP */}
          {deliveryType==='store'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {/* Tỉnh + Quận */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <div style={lbl}>TỈNH / THÀNH PHỐ</div>
                  <div style={{position:'relative'}}>
                    <select style={sel} value={province} onChange={e=>this.setState({province:e.target.value,district:'',selectedStore:''})} onFocus={this.foc} onBlur={this.blu}>
                      <option value="">Chọn tỉnh/thành phố</option>
                      {PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#aaa',fontSize:'11px'}}>▼</span>
                  </div>
                </div>
                <div>
                  <div style={lbl}>QUẬN / HUYỆN</div>
                  <div style={{position:'relative'}}>
                    <select style={{...sel,color:!province?'#aaa':'#1a1a1a'}} value={district} onChange={e=>this.setState({district:e.target.value,selectedStore:''})} disabled={!province} onFocus={this.foc} onBlur={this.blu}>
                      <option value="">Chọn quận/huyện</option>
                      {this.districts.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                    <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#aaa',fontSize:'11px'}}>▼</span>
                  </div>
                </div>
              </div>

              {/* CỬA HÀNG */}
              <div>
                <div style={lbl}>CỬA HÀNG</div>
                <div style={{position:'relative'}}>
                  <select style={{...sel,color:!district?'#aaa':'#1a1a1a'}} value={selectedStore} onChange={e=>this.setState({selectedStore:e.target.value})} disabled={!district} onFocus={this.foc} onBlur={this.blu}>
                    <option value="">{!province?'Vui lòng chọn tỉnh/TP trước':!district?'Vui lòng chọn quận/huyện trước':this.stores.length===0?'Không có cửa hàng tại khu vực này':'Chọn địa chỉ cửa hàng'}</option>
                    {this.stores.map((s,i)=><option key={i} value={s}>{s}</option>)}
                  </select>
                  <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#aaa',fontSize:'11px'}}>▼</span>
                </div>
                {district&&this.stores.length===0&&(
                  <div style={{marginTop:'10px',background:'#fff8e6',border:'1px solid #fde68a',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#92400e'}}>
                    ⚠️ Chưa có cửa hàng tại khu vực này. Vui lòng chọn <b>Giao hàng tận nơi</b> hoặc chọn quận khác.
                  </div>
                )}
                {selectedStore&&(
                  <div style={{marginTop:'10px',background:'#f0f9f4',border:'1px solid #a7f3d0',borderRadius:'8px',padding:'12px 14px'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
                      <span style={{color:'#059669',fontSize:'16px',flexShrink:0}}>📍</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:'13.5px',color:'#1a1a1a',marginBottom:'3px'}}>{selectedStore}</div>
                        <div style={{fontSize:'12px',color:'#555'}}>Thứ 2 – Chủ nhật: 8:00 – 21:00</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div style={lbl}>GHI CHÚ (nếu có)</div>
                <input style={inp} value={note} onChange={e=>this.setState({note:e.target.value})} placeholder="Ghi chú thêm..." onFocus={this.foc} onBlur={this.blu}/>
              </div>
            </div>
          )}

          {/* HOME DELIVERY */}
          {deliveryType==='delivery'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <div style={lbl}>TÊN NGƯỜI NHẬN</div>
                  <input style={inp} value={recipientName} onChange={e=>this.setState({recipientName:e.target.value})} placeholder="Nguyễn Văn A" onFocus={this.foc} onBlur={this.blu}/>
                </div>
                <div>
                  <div style={lbl}>SĐT NGƯỜI NHẬN</div>
                  <input style={inp} value={recipientPhone} onChange={e=>this.setState({recipientPhone:e.target.value})} placeholder="0912 345 678" onFocus={this.foc} onBlur={this.blu}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <div style={lbl}>TỈNH / THÀNH PHỐ</div>
                  <div style={{position:'relative'}}>
                    <select style={sel} value={province} onChange={e=>this.setState({province:e.target.value,district:''})} onFocus={this.foc} onBlur={this.blu}>
                      <option value="">Chọn tỉnh/TP</option>
                      {PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#aaa',fontSize:'11px'}}>▼</span>
                  </div>
                </div>
                <div>
                  <div style={lbl}>QUẬN / HUYỆN</div>
                  <div style={{position:'relative'}}>
                    <select style={{...sel,color:!province?'#aaa':'#1a1a1a'}} value={district} onChange={e=>this.setState({district:e.target.value})} disabled={!province} onFocus={this.foc} onBlur={this.blu}>
                      <option value="">Chọn quận/huyện</option>
                      {this.districts.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                    <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#aaa',fontSize:'11px'}}>▼</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={lbl}>ĐỊA CHỈ CỤ THỂ</div>
                <input style={inp} value={address} onChange={e=>this.setState({address:e.target.value})} placeholder="Số nhà, tên đường, phường/xã..." onFocus={this.foc} onBlur={this.blu}/>
              </div>
              {district&&(
                <div style={{background:'rgba(215,0,24,0.05)',border:'1px solid rgba(215,0,24,0.15)',borderRadius:'8px',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{color:'#d70018',fontSize:'16px',flexShrink:0}}>🕐</span>
                  <span style={{fontSize:'13px',color:'#555'}}>Giao thông thường: trước 12 giờ ngày {new Date(Date.now()+86400000).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              <div>
                <div style={lbl}>GHI CHÚ (nếu có)</div>
                <textarea style={{...inp,height:'68px',resize:'none',lineHeight:1.5}} value={note} onChange={e=>this.setState({note:e.target.value})} placeholder="Ghi chú thêm cho đơn hàng..." onFocus={this.foc} onBlur={this.blu}/>
              </div>
            </div>
          )}
        </div>

        {/* Xuất hóa đơn */}
        <div style={card}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:'14px',fontWeight:600,color:'#1a1a1a'}}>Quý khách có muốn xuất hóa đơn công ty không?</span>
            <div style={{display:'flex',gap:'16px'}}>
              {['yes','no'].map(v=>(
                <label key={v} style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',fontSize:'13.5px',fontWeight:600,color:wantInvoice===v?'#d70018':'#555'}}>
                  <input type="radio" name="invoice" value={v} checked={wantInvoice===v} onChange={()=>this.setState({wantInvoice:v})} style={{accentColor:'#d70018'}}/>{v==='yes'?'Có':'Không'}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div style={{...card,background:'#fafafa'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'14px',color:'#555',marginBottom:'6px'}}><span>Tổng tiền hàng</span><span>{total.toLocaleString()}đ</span></div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'14px',color:'#00a650',fontWeight:700,marginBottom:'8px'}}><span>Phí vận chuyển</span><span>Miễn phí</span></div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'16px',fontWeight:800,borderTop:'2px solid #eee',paddingTop:'10px'}}><span style={{color:'#1a1a1a'}}>Tổng tiền tạm tính:</span><span style={{color:'#d70018'}}>{total.toLocaleString()}đ</span></div>
        </div>
        <button onClick={()=>this.goToStep2()} style={btnR}>Tiếp tục →</button>
      </div>
    );
  }

  renderStep2(mycart,total,customer){
    const {paymentMethod,deliveryType,selectedStore,address,district,province,recipientName,recipientPhone,loading}=this.state;
    const chosen=PAYMENT_METHODS.find(p=>p.id===paymentMethod);
    const provName=PROVINCES.find(p=>p.id===province)?.name||'';
    const delivAddr=deliveryType==='store'?selectedStore:`${address}${district?', '+district:''}${provName?', '+provName:''}`;
    return(
      <div>
        {/* Summary */}
        <div style={card}>
          <div style={{fontSize:'11px',fontWeight:800,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'12px'}}>Tóm tắt đơn hàng</div>
          <Row label="Số lượng SP" value={<b>{mycart.reduce((s,i)=>s+i.quantity,0)}</b>}/>
          <Row label="Tổng tiền hàng" value={total.toLocaleString()+'đ'}/>
          <Row label="Phí vận chuyển" value={<span style={{color:'#00a650',fontWeight:700}}>Miễn phí</span>}/>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'17px',fontWeight:900,borderTop:'2px solid #eee',paddingTop:'12px',marginTop:'4px'}}>
            <span style={{color:'#1a1a1a'}}>Tổng tiền</span><span style={{color:'#d70018'}}>{total.toLocaleString()}đ</span>
          </div>
          <div style={{fontSize:'11.5px',color:'#aaa',textAlign:'right',marginTop:'3px'}}>Đã gồm VAT và được làm tròn</div>
        </div>

        {/* Payment method */}
        <div style={sec}>THÔNG TIN THANH TOÁN</div>
        <div style={{...card,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',border:`1.5px solid ${paymentMethod?'#d70018':'#e0e0e0'}`}} onClick={()=>this.setState({showPaymentModal:true,selectedPaymentTemp:paymentMethod})}>
          {chosen?(
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'24px'}}>{chosen.icon}</span>
              <div><div style={{fontWeight:700,fontSize:'14px',color:'#1a1a1a'}}>{chosen.label}</div><div style={{fontSize:'12px',color:'#888'}}>{chosen.sub}</div></div>
            </div>
          ):(
            <div style={{display:'flex',alignItems:'center',gap:'10px',color:'#d70018'}}>
              <span style={{fontSize:'20px'}}>💳</span><span style={{fontWeight:600,fontSize:'14px'}}>Chọn phương thức thanh toán</span>
            </div>
          )}
          <span style={{color:'#d70018',fontSize:'20px'}}>›</span>
        </div>

        {/* Delivery info */}
        <div style={sec}>THÔNG TIN NHẬN HÀNG</div>
        <div style={card}>
          {[['Khách hàng',customer?.name],['Số điện thoại',recipientPhone||customer?.phone],['Email',customer?.email],['Nhận hàng tại',delivAddr||'—'],['Người nhận',`${recipientName||customer?.name} – ${recipientPhone||customer?.phone}`]].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'8px 0',borderBottom:'1px solid #f5f5f5',gap:'12px'}}>
              <span style={{fontSize:'13px',color:'#888',flexShrink:0,width:'120px'}}>{k}</span>
              <span style={{fontSize:'13px',color:'#1a1a1a',fontWeight:500,textAlign:'right',flex:1}}>{v||'—'}</span>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'10px 0',fontSize:'12.5px',color:'#555'}}>
          <input type="checkbox" defaultChecked style={{accentColor:'#d70018',marginTop:'2px',flexShrink:0}}/>
          <span>Bằng việc Đặt hàng, bạn đồng ý với <span style={{color:'#d70018',fontWeight:700}}>Điều khoản sử dụng</span> của PhoneShop. Giao dịch từ 10 triệu có thể yêu cầu xác minh thông tin.</span>
        </div>

        {/* Total */}
        <div style={{...card,background:'#fff9f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'15px',fontWeight:700}}>Tổng tiền tạm tính:</span>
          <span style={{fontSize:'18px',fontWeight:900,color:'#d70018'}}>{total.toLocaleString()}đ</span>
        </div>
        <button onClick={()=>this.handlePlaceOrder()} disabled={loading||!paymentMethod} style={{...btnR,background:paymentMethod?'#d70018':'#d0d0d0',cursor:paymentMethod?'pointer':'not-allowed',boxShadow:paymentMethod?'0 4px 20px rgba(215,0,24,0.3)':'none'}}>
          {loading?'⏳ Đang xử lý...':paymentMethod==='QR'?'📲 Thanh toán QR':'✅ Đặt hàng ngay'}
        </button>
        <div style={{textAlign:'center',marginTop:'12px',fontSize:'12.5px',color:'#d70018',cursor:'pointer'}} onClick={()=>this.props.navigate('/mycart')}>← Kiểm tra giỏ hàng ({mycart.length} sản phẩm)</div>
      </div>
    );
  }

  renderPaymentModal(){
    const {selectedPaymentTemp}=this.state;
    return(
      <div style={ovrl} onClick={()=>this.setState({showPaymentModal:false})}>
        <div style={{background:'#fff',borderRadius:'16px',width:'100%',maxWidth:'480px',maxHeight:'85vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 24px 64px rgba(0,0,0,0.2)'}} onClick={e=>e.stopPropagation()}>
          <div style={{padding:'18px 20px',borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:'16px',fontWeight:800}}>Chọn phương thức thanh toán</span>
            <button onClick={()=>this.setState({showPaymentModal:false})} style={{background:'none',border:'none',fontSize:'22px',cursor:'pointer',color:'#888',lineHeight:1}}>×</button>
          </div>
          <div style={{flex:1,overflow:'auto',padding:'10px 16px'}}>
            <div style={{fontSize:'11px',fontWeight:800,color:'#aaa',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>KHẢ DỤNG</div>
            {PAYMENT_METHODS.map(pm=>(
              <div key={pm.id} onClick={()=>this.setState({selectedPaymentTemp:pm.id})} style={{display:'flex',alignItems:'center',gap:'14px',padding:'13px 16px',borderRadius:'10px',cursor:'pointer',border:`2px solid ${selectedPaymentTemp===pm.id?pm.color:'transparent'}`,background:selectedPaymentTemp===pm.id?`${pm.color}0d`:'transparent',marginBottom:'8px',transition:'all 0.15s'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'10px',background:`${pm.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>{pm.icon}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:'14px',color:'#1a1a1a'}}>{pm.label}</div><div style={{fontSize:'12.5px',color:'#888',marginTop:'2px'}}>{pm.sub}</div></div>
                <div style={{width:'20px',height:'20px',borderRadius:'50%',border:`2px solid ${selectedPaymentTemp===pm.id?pm.color:'#ddd'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {selectedPaymentTemp===pm.id&&<div style={{width:'10px',height:'10px',borderRadius:'50%',background:pm.color}}/>}
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:'14px 16px',borderTop:'1px solid #f0f0f0'}}>
            <button onClick={()=>{if(this.state.selectedPaymentTemp)this.setState({paymentMethod:this.state.selectedPaymentTemp,showPaymentModal:false});}} disabled={!selectedPaymentTemp} style={{...btnR,background:selectedPaymentTemp?'#d70018':'#e0e0e0',cursor:selectedPaymentTemp?'pointer':'not-allowed',boxShadow:'none'}}>Xác nhận</button>
          </div>
        </div>
      </div>
    );
  }

  renderQRModal(total){
    const { qrCountdown, qrPaid, loading, qrRef } = this.state;
    const ref = qrRef || `PS${Date.now().toString().slice(-8)}`;
    return(
      <div style={ovrl}>
        <div style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'390px',overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,0.25)'}} onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div style={{background:'linear-gradient(135deg,#1a56db 0%,#2563eb 100%)',padding:'22px',textAlign:'center',color:'#fff'}}>
            <div style={{fontSize:'32px',marginBottom:'6px'}}>{qrPaid?'✅':'📲'}</div>
            <div style={{fontSize:'17px',fontWeight:800}}>{qrPaid?'Thanh toán thành công!':'Chuyển khoản QR'}</div>
            <div style={{fontSize:'12.5px',opacity:0.8,marginTop:'4px'}}>
              {qrPaid?'Đơn hàng đang được xử lý':'Quét mã để thanh toán ngay'}
            </div>
          </div>

          {qrPaid ? (
            /* SUCCESS STATE */
            <div style={{padding:'28px',textAlign:'center'}}>
              <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'rgba(16,185,129,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',margin:'0 auto 16px'}}>🎉</div>
              <h3 style={{fontSize:'18px',fontWeight:900,color:'#059669',margin:'0 0 8px'}}>VLUPhone đã nhận được thanh toán!</h3>
              <p style={{fontSize:'13px',color:'#555',margin:'0 0 6px'}}>Số tiền: <strong style={{color:'#d70018'}}>{total.toLocaleString()}đ</strong></p>
              <p style={{fontSize:'13px',color:'#555',margin:'0 0 20px'}}>Nội dung CK: <strong style={{fontFamily:'monospace'}}>{ref}</strong></p>
              <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:'10px',padding:'12px',marginBottom:'20px',fontSize:'12.5px',color:'#15803d'}}>
                ✅ Giao dịch xác nhận lúc {new Date().toLocaleTimeString('vi-VN')} • Ngân hàng VIETCOMBANK
              </div>
              <button onClick={()=>{this.placeOrder();}} disabled={loading}
                style={{...btnR,background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 16px rgba(5,150,105,0.35)'}}>
                {loading?'⏳ Đang đặt hàng...':'🛍️ Hoàn tất đặt hàng'}
              </button>
            </div>
          ) : (
            /* QR SCAN STATE */
            <div style={{padding:'20px'}}>
              <div style={{display:'flex',justifyContent:'center',marginBottom:'14px'}}>
                <div style={{padding:'14px',border:'2px solid #e0e0e0',borderRadius:'14px',display:'inline-block',position:'relative'}}>
                  <QRCode value={ref+total} size={172}/>
                  {qrCountdown > 0 && (
                    <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.92)',borderRadius:'12px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <div style={{fontSize:'13px',color:'#555',marginBottom:'8px'}}>⏳ Đang xác nhận thanh toán...</div>
                      <div style={{fontSize:'36px',fontWeight:900,color:'#1a56db'}}>{qrCountdown}</div>
                      <div style={{width:'120px',height:'6px',background:'#e0e0e0',borderRadius:'3px',marginTop:'10px',overflow:'hidden'}}>
                        <div style={{width:`${(qrCountdown/5)*100}%`,height:'100%',background:'#1a56db',borderRadius:'3px',transition:'width 1s linear'}}/>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{background:'#f8f9fa',borderRadius:'10px',padding:'12px 14px',marginBottom:'12px'}}>
                {[['Ngân hàng','VIETCOMBANK'],['Số tài khoản','1234 5678 9000'],['Tên tài khoản','PHONESHOP VN'],['Số tiền',total.toLocaleString()+'đ'],['Nội dung CK',ref]].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px dashed #eee'}}>
                    <span style={{fontSize:'12px',color:'#888'}}>{k}</span>
                    <span style={{fontSize:'13px',fontWeight:700,color:k==='Số tiền'?'#d70018':'#1a1a1a',fontFamily:k==='Nội dung CK'||k==='Số tài khoản'?'monospace':'inherit'}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'8px',padding:'9px 12px',fontSize:'12px',color:'#92400e',marginBottom:'12px',lineHeight:1.5}}>
                ⚠️ Vui lòng chuyển đúng số tiền và nội dung. Đơn hàng xác nhận sau khi nhận thanh toán.
              </div>
              {/* Fake: bấm "Đã quét QR" → simulate 5s countdown → auto confirm */}
              <button
                onClick={()=>this.startQRCountdown()}
                disabled={qrCountdown > 0}
                style={{...btnR,background: qrCountdown>0 ? '#9ca3af' : '#1a56db', boxShadow:'0 4px 16px rgba(26,86,219,0.3)',cursor:qrCountdown>0?'not-allowed':'pointer'}}>
                {qrCountdown > 0 ? `⏳ Đang xác nhận... (${qrCountdown}s)` : '📱 Đã quét QR'}
              </button>
              <div style={{textAlign:'center',marginTop:'10px',fontSize:'12.5px',color:'#aaa',cursor:'pointer'}} onClick={()=>this.setState({showQR:false,qrCountdown:0})}>Quay lại</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  goToStep2(){
    const {deliveryType,province,district,selectedStore,recipientName,recipientPhone,address}=this.state;
    if(deliveryType==='store'){
      if(!province){alert('Vui lòng chọn Tỉnh/Thành phố!');return;}
      if(!district){alert('Vui lòng chọn Quận/Huyện!');return;}
      if(!selectedStore){alert('Vui lòng chọn cửa hàng!');return;}
    }else{
      if(!recipientName.trim()){alert('Vui lòng nhập tên người nhận!');return;}
      if(!recipientPhone.trim()){alert('Vui lòng nhập số điện thoại!');return;}
      if(!address.trim()){alert('Vui lòng nhập địa chỉ giao hàng!');return;}
    }
    this.setState({step:2});
    window.scrollTo(0,0);
  }

  handlePlaceOrder(){
    if(!this.state.paymentMethod){alert('Vui lòng chọn phương thức thanh toán!');return;}
    if(this.state.paymentMethod==='QR'){
      const ref=`PS${Date.now().toString().slice(-8)}`;
      this.setState({showQR:true,qrRef:ref,qrCountdown:0,qrPaid:false});
      return;
    }
    this.placeOrder();
  }

  startQRCountdown(){
    this.setState({qrCountdown:5});
    const tick=setInterval(()=>{
      this.setState(prev=>{
        if(prev.qrCountdown<=1){
          clearInterval(tick);
          return{qrCountdown:0,qrPaid:true};
        }
        return{qrCountdown:prev.qrCountdown-1};
      });
    },1000);
  }

  placeOrder(){
    const {token,customer,mycart}=this.context;
    const total=CartUtil.getTotal(mycart);
    const {deliveryType,selectedStore,address,district,province,recipientName,recipientPhone,note,paymentMethod}=this.state;
    const provName=PROVINCES.find(p=>p.id===province)?.name||'';
    this.setState({loading:true});
    const orderCustomer={
      ...customer,
      deliveryType,
      deliveryAddress:deliveryType==='store'?selectedStore:`${address}, ${district}, ${provName}`,
      recipientName:recipientName||customer?.name,
      recipientPhone:recipientPhone||customer?.phone,
      note, paymentMethod,
    };
    axios.post('/api/customer/checkout',{total,items:mycart,customer:orderCustomer},{headers:{'x-access-token':token}})
      .then(res=>{
        if(res.data){
          this.context.setMycart([]);
          this.setState({loading:false,done:true});
          alert('🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.');
        }
      })
      .catch(()=>{this.setState({loading:false});alert('❌ Lỗi đặt hàng, vui lòng thử lại!');});
  }
}

export default withRouter(Checkout);
