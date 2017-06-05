const replicationUtils = {
    requiredConfigProperties: [
        'Role',
        'Rules',
        'Status',
        'Prefix',
        'Destination',
        'Bucket',
    ],
    optionalConfigProperties: [
        'ID',
        'StorageClass',
    ],
    invalidRoleARNs: [
        'arn:partition:service::account-id:resourcetype', // Missing resource.
        'arn:partition:service::account-id:resourcetype/resource/extra-value',
        'arn:partition:service::account-id:resourcetype:resource:extra-value',
    ],
    // Role value should be an Amazon Resource Name IAM user name format.
    validRoleARNs: [
        'arn:partition:service::account-id:resourcetype/resource',
        'arn:partition:service::account-id:resourcetype:resource',
    ],
    invalidBucketARNs: [
        'arn:partition:service::resource', // Missing an omitted account-id.
        'arn:partition:service::::resource',
    ],
    validStatuses: [
        'Enabled',
        'Disabled',
    ],
    validStorageClasses: [
        'STANDARD',
        'STANDARD_IA',
        'REDUCED_REDUNDANCY',
    ],
};

// Create replication configuration XML with an tag optionally omitted.
function createReplicationXML(missingTag, tagValue) {
    const Role = missingTag === 'Role' ? '' :
        '<Role>arn:partition:service::account-id:resourcetype/resource</Role>';
    let ID = missingTag === 'ID' ? '' : '<ID>foo</ID>';
    ID = tagValue && tagValue.ID === '' ? '<ID/>' : ID;
    const Prefix = missingTag === 'Prefix' ? '' : '<Prefix>foo</Prefix>';
    const Status = missingTag === 'Status' ? '' : '<Status>Enabled</Status>';
    const Bucket = missingTag === 'Bucket' ? '' :
        '<Bucket>arn:aws:s3:::destination-bucket</Bucket>';
    const StorageClass = missingTag === 'StorageClass' ? '' :
        '<StorageClass>STANDARD</StorageClass>';
    const Destination = missingTag === 'Destination' ? '' :
        `<Destination>${Bucket + StorageClass}</Destination>`;
    const Rule = missingTag === 'Rule' ? '' :
        `<Rule>${ID + Prefix + Status + Destination}</Rule>`;
    const content = missingTag === null ? '' : `${Role}${Rule}`;
    return '<ReplicationConfiguration ' +
            `xmlns="http://s3.amazonaws.com/doc/2006-03-01/">${content}` +
        '</ReplicationConfiguration>';
}

module.exports = {
    replicationUtils,
    createReplicationXML,
};
