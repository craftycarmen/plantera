function Error404({ type }) {
    return (
        <section style={{ marginTop: '20px' }}>
            <div><img
                style={
                    {
                        display: 'block',
                        width: '200px',
                        margin: 'auto',
                    }
                }
                src='../../ohno.png' /></div>
            <div style={{ textAlign: "center", marginTop: '50px' }}>{type} doesn&#39;t exist. Try again!</div>
        </section>
    )
}

export default Error404
