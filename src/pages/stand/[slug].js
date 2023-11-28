import React from 'react'
import Layout from '../../components/Layout'
import { getAllDataByType, getDataBySlug } from '../../lib/cosmic'
import { PageMeta } from '../../components/Meta'

const Stand = ({navigationItems, categoryData}) => {
    return (
        <Layout navigationPaths={navigationItems[0]?.metadata}>
            <PageMeta
                title={categoryData[0]?.title + ' | uNFT Marketplace'}
                description={
                    'uNFT Marketplace built with Cosmic CMS, Next.js'
                }
            />
        </Layout>
    )
}

export default Stand

export async function getServerSideProps({ params }) {
    const navigationItems = (await getAllDataByType('navigation')) || []
    const categoryData = (await getDataBySlug(params.slug, 'categories'))

    if (!categoryData) {
        return {
            notFound: true,
        }
    }

    return {
        props: { navigationItems, categoryData },
    }
}