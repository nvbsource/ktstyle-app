import { Modal } from 'antd'
import React from 'react'

export default function TopicManageModal({ visible, setShowTocpic }) {
    return (
        <Modal
            visible={visible}
            onCancel={() => setShowTocpic(false)}
            footer={null}
            width="80%"
            title="Quản lý chủ đề bài viết"
        >
            <div>TopicManageModal</div>
        </Modal>
    )
}
