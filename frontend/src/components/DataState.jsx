
export default function DataState({
  loading = false,
  error = "",
  isEmpty = false,
  onRetry,
  children,
}) {
  if (loading) {
    return (
      <div className="data-state" role="status">
        <span className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-state error-state" role="alert">
        <h3>Không thể tải dữ liệu</h3>
        <p>{error}</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="data-state empty-state">
        <div className="empty-icon">📋</div>
        <h3>Chưa có dữ liệu</h3>
        <p>Hãy thử lại sau hoặc tạo yêu cầu mới.</p>
      </div>
    );
  }

  return children;
}
