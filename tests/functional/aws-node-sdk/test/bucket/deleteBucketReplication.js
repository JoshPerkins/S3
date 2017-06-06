const assert = require('assert');
const { S3 } = require('aws-sdk');
const { series } = require('async');

const getConfig = require('../support/config');
const BucketUtility = require('../../lib/utility/bucket-util');

const bucket = 'source-bucket';
const replicationConfig = {
    Role: 'arn:partition:service::account-id:resourcetype/resource',
    Rules: [
        {
            Destination: { Bucket: 'arn:aws:s3:::destination-bucket' },
            Prefix: 'test-prefix',
            Status: 'Enabled',
        },
    ],
};

describe.only('aws-node-sdk test deleteBucketReplication', () => {
    let s3;
    let otherAccountS3;

    beforeEach(done => {
        const config = getConfig('default', { signatureVersion: 'v4' });
        s3 = new S3(config);
        otherAccountS3 = new BucketUtility('lisa', {}).s3;
        return series([
            next => s3.createBucket({ Bucket: bucket }, next),
            next => s3.putBucketVersioning({
                Bucket: bucket,
                VersioningConfiguration: { Status: 'Enabled' },
            }, next),
        ], done);
    });

    afterEach(done => s3.deleteBucket({ Bucket: bucket }, done));

    it('should return empty object if bucket has no replication config', done =>
        s3.deleteBucketReplication({ Bucket: bucket }, (err, data) => {
            assert.strictEqual(err, null);
            assert.deepStrictEqual(data, {});
            return done();
        }));

    it('should delete a bucket replication config when it has one', done =>
        series([
            next => s3.putBucketReplication({
                Bucket: bucket,
                ReplicationConfiguration: replicationConfig,
            }, next),
            next =>
                s3.deleteBucketReplication({ Bucket: bucket }, (err, data) => {
                    assert.strictEqual(err, null);
                    assert.deepStrictEqual(data, {});
                    return next();
                }),
        ], done));

    it('should return AccessDenied if user is not bucket owner', done =>
        otherAccountS3.deleteBucketReplication({ Bucket: bucket }, err => {
            assert(err);
            assert.strictEqual(err.code, 'AccessDenied');
            assert.strictEqual(err.statusCode, 403);
            return done();
        }));
});
