function EditPageShimmer() {
    return (
        <>
            <div className="edit-project-card border p-2">
                <div className="editShimmer" style={{ height: '20px', width: '200px', marginBottom: '12px' }}></div>
                <div className="editShimmer" style={{ height: '60px', width: '100%', marginBottom: '12px' }}></div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div className="editShimmer" style={{ height: '40px', width: '48%' }}></div>
                    <div className="editShimmer" style={{ height: '40px', width: '48%' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div className="editShimmer" style={{ height: '40px', width: '48%' }}></div>
                    <div className="editShimmer" style={{ height: '40px', width: '48%' }}></div>
                </div>

                <div className="editShimmer" style={{ height: '40px', width: '150px' }}></div>
            </div>

        </>
    );
}

export default EditPageShimmer;