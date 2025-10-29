// src/PlansOverview.jsx
import React, { useState } from 'react';
import './PlansOverview.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { priceMapValue } from './priceMap';
import {
  ChatBubbleLeftEllipsisIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

const API_BASE = "https://api.dailywithminh.com/api";

export default function PlansOverview() {
  const plans = ['Gói tiết kiệm', 'Gói cao cấp'];
  const durations = ['01 tháng', '03 tháng', '06 tháng', '12 tháng'];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const navigate = useNavigate();

  const planDescriptions = {
    'Gói tiết kiệm':
      '✔ Bảo hành tự động 24/7 – đổi tài khoản chỉ trong vài giây khi gặp sự cố.  \n✔ CSKH trực tuyến 24/7 – hỗ trợ nhanh chóng, nhắc nhở gia hạn kịp thời.  \n👉 Cam kết mang đến cho anh/chị trải nghiệm xem phim liền mạch, không gián đoạn!  ',
    'Gói cao cấp':
      '✔ Tài khoản có 5 hồ sơ, anh/chị sẽ sử dụng 1 hồ sơ riêng với mã PIN bảo mật.  \n✔ Có đường dẫn xác minh hộ gia đình tự và có CSKH trực tuyến 24/7 hỗ trợ nhanh chóng  \n👉 Đảm bảo trải nghiệm cá nhân hóa, tiện lợi và an toàn tuyệt đối! ',
  };

  const priceMapDisplay = {
    'Gói tiết kiệm': {
      '01 tháng': '50.000₫',
      '03 tháng': '140.000₫',
      '06 tháng': '270.000₫',
      '12 tháng': '500.000₫',
    },
    'Gói cao cấp': {
      '01 tháng': '90.000₫',
      '03 tháng': '260.000₫',
      '06 tháng': '515.000₫',
      '12 tháng': '1.000.000₫',
    },
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setSelectedDuration(durations[0]);
  };

  const amount = selectedPlan ? priceMapValue[selectedPlan][selectedDuration] : 0;
  const displayPrice = selectedPlan
    ? priceMapDisplay[selectedPlan][selectedDuration]
    : 'Giá từ 50.000₫ đến 1.000.000₫';

  const durationToDays = {
    '01 tháng': 30,
    '03 tháng': 90,
    '06 tháng': 180,
    '12 tháng': 365,
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    if (!window.confirm('Bạn có muốn thanh toán không?')) return;

    // ===== Thực hiện mua trực tiếp trên server, không dùng localStorage =====
    try {
      if (selectedPlan === 'Gói tiết kiệm') {
        const planDays = durationToDays[selectedDuration] || 30;

        const res = await axios.post(
          `${API_BASE}/account50k/buy`,
          { planDays, amount },
          { headers: { 'Content-Type': 'application/json' } } // Không dùng token
        );

        if (!res.data || res.data.success !== true) {
          throw new Error(res.data?.message || 'Mua thất bại');
        }

        const { order } = res.data.data;
        alert(
          `Thanh toán thành công!\nMã đơn: ${order.orderCode}\nUsername: ${order.accountEmail}\nPassword: ${order.accountPassword}`
        );
        navigate('/my-orders');
        return;
      }

      // ===== Nhánh Gói cao cấp =====
      const { data } = await axios.post(
        `${API_BASE}/orders`,
        { plan: selectedPlan, duration: selectedDuration, amount },
        { headers: { 'Content-Type': 'application/json' } } // Không dùng token
      );

      if (data.netflixAccount) {
        const { email, password, profileName, pin } = data.netflixAccount;
        alert(
          `Thanh toán thành công!\nEmail: ${email}\nMật khẩu: ${password}\nTên hồ sơ: ${profileName}\nMã PIN: ${pin}`
        );
      } else {
        alert('Thanh toán thành công!');
      }

      navigate('/my-orders');
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      const serverMsg = err?.response?.data?.message || err?.message;
      alert(`Thanh toán thất bại: ${serverMsg || 'Lỗi server'}`);
    }
  };

  return (
    <div className="plans-overview">
      <div className="bg-cover-bg" />
      <div className="bg-overlay" />

      <div className="content-wrapper">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="netflix-card">
            <img src="/images/netflix-icon.png" alt="Netflix" className="netflix-icon" />
            <button className="zoom-btn">
              <ArrowsPointingOutIcon className="zoom-icon" />
            </button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <ChatBubbleLeftEllipsisIcon className="stat-icon" /> <span>525 Đánh giá</span>
            </div>
            <div className="stat-item">
              <ShoppingCartIcon className="stat-icon" /> <span>28586 Đã bán</span>
            </div>
            <div className="stat-item">
              <ShieldCheckIcon className="stat-icon" /> <span>Bảo hành 24/7</span>
            </div>
            <div className="stat-item">
              <StarIcon className="stat-icon" /> <span>5.0</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel mobile-card">
          <h1 className="title">Mua Tài khoản Netflix Premium</h1>
          <p className="price">{displayPrice}</p>

          <div className="plan-selection">
            {plans.map((p) => (
              <button
                key={p}
                onClick={() => handlePlanChange(p)}
                className={`btn-plan ${selectedPlan === p ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>

          {selectedPlan && (
            <>
              <p className="description">{planDescriptions[selectedPlan]}</p>
              <div className="duration-selection">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`btn-duration ${selectedDuration === d ? 'active' : ''}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedPlan && (
            <button className="btn-pay main-pay" onClick={handlePayment}>
              Thanh toán
            </button>
          )}
        </div>
      </div>

      {/* Sticky CTA (hiện trên mobile nhờ CSS) */}
      {selectedPlan && (
        <div className="sticky-cta">
          <div className="summary">
            <div>
              <strong>{selectedPlan}</strong> • {selectedDuration}
            </div>
            <div>{displayPrice}</div>
          </div>
          <button className="btn-pay" onClick={handlePayment}>
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
}
